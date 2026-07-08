import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { Application, Chat, Freelancer, Project, User } from './Schema.js';
import { Server } from 'socket.io';
import http from 'http';
import SocketHandler from './SocketHandler.js';

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const PORT = process.env.PORT || 6001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Freelancing';

app.use(express.json());
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({
    origin: [CLIENT_ORIGIN, 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [CLIENT_ORIGIN, 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    SocketHandler(socket);
});


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {

    app.post('/register', async (req, res) => {
        try {
            const { username, email, password, usertype } = req.body;

            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            const newUser = new User({
                username,
                email,
                password: passwordHash,
                usertype
            });

            const user = await newUser.save();

            if (usertype === 'freelancer') {
                const newFreelancer = new Freelancer({
                    userId: user._id
                });
                await newFreelancer.save();
            }

            res.status(200).json(user);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    app.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email: email });
            if (!user) return res.status(400).json({ msg: 'User does not exist' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    app.get('/fetch-freelancer/:id', async (req, res) => {
        try {
            const freelancer = await Freelancer.findOne({ userId: req.params.id });
            res.status(200).json(freelancer);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/update-freelancer', async (req, res) => {
        const { freelancerId, updateSkills, description } = req.body;
        try {
            const freelancer = await Freelancer.findById(freelancerId);

            const skills = updateSkills.split(',').map(s => s.trim()).filter(Boolean);

            freelancer.skills = skills;
            freelancer.description = description;

            await freelancer.save();

            res.status(200).json(freelancer);

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // fetch project
    app.get('/fetch-project/:id', async (req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            res.status(200).json(project);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // fetch all projects
    app.get('/fetch-projects', async (req, res) => {
        try {
            const projects = await Project.find();
            res.status(200).json(projects);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/new-project', async (req, res) => {
        const { title, description, budget, skills, clientId, clientName, clientEmail } = req.body;
        try {
            const projectSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
            const newProject = new Project({
                title,
                description,
                budget,
                skills: projectSkills,
                clientId,
                clientName,
                clientEmail,
                postedDate: new Date()
            });
            await newProject.save();
            res.status(200).json({ message: 'Project added' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // make bid
    app.post('/make-bid', async (req, res) => {
        const { clientId, freelancerId, projectId, proposal, bidAmount, estimatedTime } = req.body;
        try {
            const freelancer = await User.findById(freelancerId);
            const freelancerData = await Freelancer.findOne({ userId: freelancerId });
            const project = await Project.findById(projectId);
            const client = await User.findById(clientId);

            const newApplication = new Application({
                projectId,
                clientId,
                clientName: client.username,
                clientEmail: client.email,
                freelancerId,
                freelancerName: freelancer.username,
                freelancerEmail: freelancer.email,
                freelancerSkills: freelancerData.skills,
                title: project.title,
                description: project.description,
                budget: project.budget,
                requiredSkills: project.skills,
                proposal,
                bidAmount,
                estimatedTime
            });

            const application = await newApplication.save();

            project.bids.push(freelancerId);
            project.bidAmounts.push(parseInt(bidAmount));

            if (application) {
                freelancerData.applications.push(application._id);
            }

            await freelancerData.save();
            await project.save();

            res.status(200).json({ message: 'bidding successful' });
        } catch (err) {
            console.error('make-bid error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });


    // fetch all applications
    app.get('/fetch-applications', async (req, res) => {
        try {
            const applications = await Application.find();
            res.status(200).json(applications);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // approve application
    app.get('/approve-application/:id', async (req, res) => {
        try {
            const application = await Application.findById(req.params.id);
            const project = await Project.findById(application.projectId);
            const freelancer = await Freelancer.findOne({ userId: application.freelancerId });
            const user = await User.findById(application.freelancerId);

            application.status = 'Accepted';
            await application.save();

            // Reject remaining pending applications for this project
            const remainingApplications = await Application.find({ projectId: application.projectId, status: 'Pending' });
            for (const appli of remainingApplications) {
                appli.status = 'Rejected'; // FIX: was === (comparison bug)
                await appli.save();
            }

            project.freelancerId = freelancer.userId;
            project.freelancerName = user.email;
            project.budget = application.bidAmount;
            project.status = 'Assigned';

            freelancer.currentProjects.push(project._id);

            await project.save();
            await freelancer.save();

            res.status(200).json({ message: 'Application approved!!' });

        } catch (err) {
            console.error('approve-application error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });

    // reject application
    app.get('/reject-application/:id', async (req, res) => {
        try {
            const application = await Application.findById(req.params.id);
            application.status = 'Rejected';
            await application.save();
            res.status(200).json({ message: 'Application rejected!!' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // submit project
    app.post('/submit-project', async (req, res) => {
        const { clientId, freelancerId, projectId, projectLink, manualLink, submissionDescription } = req.body;
        try {
            const project = await Project.findById(projectId);

            project.projectLink = projectLink;
            project.manulaLink = manualLink;
            project.submissionDescription = submissionDescription;
            project.submission = true;

            await project.save(); // FIX: removed duplicate project.save()
            res.status(200).json({ message: 'Project submitted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // approve submission
    app.get('/approve-submission/:id', async (req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            const freelancer = await Freelancer.findOne({ userId: project.freelancerId });

            project.submissionAccepted = true;
            project.status = 'Completed';

            // Remove from currentProjects and add to completedProjects
            freelancer.currentProjects = freelancer.currentProjects.filter(
                p => p.toString() !== project._id.toString()
            );
            freelancer.completedProjects.push(project._id);

            freelancer.funds = parseInt(freelancer.funds) + parseInt(project.budget);

            await project.save();
            await freelancer.save();

            res.status(200).json({ message: 'submission approved' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // reject submission
    app.get('/reject-submission/:id', async (req, res) => {
        try {
            const project = await Project.findById(req.params.id);

            project.submission = false;
            project.projectLink = '';
            project.manulaLink = '';
            project.submissionDescription = '';

            await project.save();

            res.status(200).json({ message: 'submission rejected' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // fetch all users
    app.get('/fetch-users', async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    // fetch chats
    app.get('/fetch-chats/:id', async (req, res) => {
        try {
            const chats = await Chat.findById(req.params.id);
            res.status(200).json(chats);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    server.listen(PORT, () => {
        console.log(`NextGig server running on port ${PORT}`);
    });

}).catch((e) => console.error(`MongoDB connection error: ${e}`));