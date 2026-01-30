import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';

// Models
import Domain from './models/Domain.js';
import Module from './models/Module.js';
import Skill from './models/Skill.js';
import Resource from './models/Resource.js';
import User from './models/User.js';
import Roadmap from './models/Roadmap.js';
import Progress from './models/Progress.js';

const seedData = async () => {
    await connectDB();

    console.log('Clearing old data...');
    await Domain.deleteMany({});
    await Module.deleteMany({});
    await Skill.deleteMany({});
    await Resource.deleteMany({});
    await User.deleteMany({});
    await Roadmap.deleteMany({});
    await Progress.deleteMany({});

    // 1️⃣ Domains
    console.log('Creating domains...');
    const domainsData = [
        {
            name: 'Frontend Development',
            description: 'Learn to build modern, accessible, and responsive web interfaces.',
            icon: '🖥️',
            technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'UI/UX'],
        },
        {
            name: 'Backend Development',
            description: 'Design and implement robust server-side applications and APIs.',
            icon: '🛠️',
            technologies: ['Node.js', 'Express', 'Databases', 'REST', 'Authentication'],
        },
        {
            name: 'Full Stack Development',
            description: 'Combine frontend and backend to build end-to-end web applications.',
            icon: '🌐',
            technologies: ['MERN Stack', 'APIs', 'Deployment', 'Testing'],
        },
        {
            name: 'Data Science',
            description: 'Extract insights from data using statistics, Python, and machine learning.',
            icon: '📊',
            technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Jupyter'],
        },
        {
            name: 'Cybersecurity',
            description: 'Understand how to secure systems, applications, and networks.',
            icon: '🛡️',
            technologies: ['OWASP', 'Network Security', 'Encryption', 'Threat Modeling'],
        },
        {
            name: 'DevOps & Cloud',
            description: 'Automate, deploy, and monitor applications at scale in the cloud.',
            icon: '☁️',
            technologies: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure'],
        },
        {
            name: 'Mobile App Development',
            description: 'Build mobile apps for Android and iOS platforms.',
            icon: '📱',
            technologies: ['React Native', 'Flutter', 'Android', 'iOS'],
        },
    ];

    const domainDocs = await Domain.insertMany(domainsData);
    const domainByName = Object.fromEntries(domainDocs.map((d) => [d.name, d]));

    // 2️⃣ Modules
    console.log('Creating modules...');
    const modulesDefinitions = [
        // Frontend Development
        {
            domain: 'Frontend Development',
            name: 'HTML & Semantic Markup',
            description: 'Structure web pages with semantic, accessible HTML.',
            order: 1,
        },
        {
            domain: 'Frontend Development',
            name: 'CSS & Responsive Design',
            description: 'Style layouts, handle responsiveness, and create modern UIs.',
            order: 2,
        },
        {
            domain: 'Frontend Development',
            name: 'JavaScript & Browser APIs',
            description: 'Add interactivity and logic with JavaScript and Web APIs.',
            order: 3,
        },
        {
            domain: 'Frontend Development',
            name: 'React Fundamentals',
            description: 'Build single-page applications with components and hooks.',
            order: 4,
        },
        // Backend Development
        {
            domain: 'Backend Development',
            name: 'Node.js Fundamentals',
            description: 'Learn Node.js runtime, modules, and asynchronous patterns.',
            order: 1,
        },
        {
            domain: 'Backend Development',
            name: 'Databases & Storage',
            description: 'Model and persist data using relational and NoSQL databases.',
            order: 2,
        },
        {
            domain: 'Backend Development',
            name: 'API Development with Express',
            description: 'Design and implement RESTful APIs using Express.',
            order: 3,
        },
        {
            domain: 'Backend Development',
            name: 'Authentication & Security',
            description: 'Secure APIs with JWT, hashing, and best-practice patterns.',
            order: 4,
        },
        // Full Stack Development
        {
            domain: 'Full Stack Development',
            name: 'MERN Stack Foundations',
            description: 'Understand how MongoDB, Express, React, and Node work together.',
            order: 1,
        },
        {
            domain: 'Full Stack Development',
            name: 'End-to-End Feature Development',
            description: 'Build features that span frontend, backend, and database.',
            order: 2,
        },
        {
            domain: 'Full Stack Development',
            name: 'Testing & Deployment',
            description: 'Test and deploy full stack applications.',
            order: 3,
        },
        // Data Science
        {
            domain: 'Data Science',
            name: 'Python for Data Analysis',
            description: 'Use Python, NumPy, and Pandas for data manipulation.',
            order: 1,
        },
        {
            domain: 'Data Science',
            name: 'Exploratory Data Analysis',
            description: 'Explore and visualize data with Matplotlib and Seaborn.',
            order: 2,
        },
        {
            domain: 'Data Science',
            name: 'Machine Learning Basics',
            description: 'Build basic ML models with scikit-learn.',
            order: 3,
        },
        // Cybersecurity
        {
            domain: 'Cybersecurity',
            name: 'Security Fundamentals',
            description: 'Learn core security concepts, threats, and controls.',
            order: 1,
        },
        {
            domain: 'Cybersecurity',
            name: 'Web Application Security',
            description: 'Understand and mitigate common web vulnerabilities.',
            order: 2,
        },
        {
            domain: 'Cybersecurity',
            name: 'Network & System Security',
            description: 'Secure networks, operating systems, and infrastructure.',
            order: 3,
        },
        // DevOps & Cloud
        {
            domain: 'DevOps & Cloud',
            name: 'Version Control & CI',
            description: 'Use Git and CI servers to automate builds.',
            order: 1,
        },
        {
            domain: 'DevOps & Cloud',
            name: 'Containers & Orchestration',
            description: 'Package apps into containers and orchestrate them.',
            order: 2,
        },
        {
            domain: 'DevOps & Cloud',
            name: 'Cloud Platforms',
            description: 'Deploy and manage apps on AWS/Azure/GCP.',
            order: 3,
        },
        // Mobile App Development
        {
            domain: 'Mobile App Development',
            name: 'Mobile UI Fundamentals',
            description: 'Design and build basic mobile UI layouts.',
            order: 1,
        },
        {
            domain: 'Mobile App Development',
            name: 'Cross-Platform Development',
            description: 'Use React Native or Flutter for cross-platform apps.',
            order: 2,
        },
        {
            domain: 'Mobile App Development',
            name: 'State Management & APIs',
            description: 'Manage app state and integrate with backend APIs.',
            order: 3,
        },
    ];

    const modulesToInsert = modulesDefinitions.map((m) => ({
        name: m.name,
        description: m.description,
        domainId: domainByName[m.domain]._id,
        order: m.order,
    }));

    const moduleDocs = await Module.insertMany(modulesToInsert);
    const moduleByKey = {};
    moduleDocs.forEach((mod) => {
        const dom = domainDocs.find((d) => d._id.equals(mod.domainId));
        if (!dom) return;
        moduleByKey[`${dom.name}::${mod.name}`] = mod;
    });

    // 3️⃣ Skills
    console.log('Creating skills...');
    const skillsDefinitions = [
        // Frontend: HTML & Semantic Markup
        {
            domain: 'Frontend Development',
            module: 'HTML & Semantic Markup',
            name: 'HTML Basics',
            level: 'Beginner',
            estimatedHours: 3,
            description: 'Learn basic tags, document structure, and common HTML elements.',
            prerequisites: [],
        },
        {
            domain: 'Frontend Development',
            module: 'HTML & Semantic Markup',
            name: 'Semantic HTML',
            level: 'Beginner',
            estimatedHours: 4,
            description: 'Use semantic tags to improve accessibility and SEO.',
            prerequisites: ['HTML Basics'],
        },
        {
            domain: 'Frontend Development',
            module: 'HTML & Semantic Markup',
            name: 'Forms & Validation',
            level: 'Intermediate',
            estimatedHours: 5,
            description: 'Build accessible forms and handle basic client-side validation.',
            prerequisites: ['HTML Basics'],
        },
        // Frontend: CSS & Responsive Design
        {
            domain: 'Frontend Development',
            module: 'CSS & Responsive Design',
            name: 'CSS Fundamentals',
            level: 'Beginner',
            estimatedHours: 5,
            description: 'Learn selectors, box model, typography, and colors.',
            prerequisites: ['HTML Basics'],
        },
        {
            domain: 'Frontend Development',
            module: 'CSS & Responsive Design',
            name: 'Flexbox & Grid',
            level: 'Intermediate',
            estimatedHours: 6,
            description: 'Create responsive layouts using Flexbox and CSS Grid.',
            prerequisites: ['CSS Fundamentals'],
        },
        {
            domain: 'Frontend Development',
            module: 'CSS & Responsive Design',
            name: 'Responsive Design Patterns',
            level: 'Intermediate',
            estimatedHours: 5,
            description: 'Implement mobile-first and responsive design techniques.',
            prerequisites: ['CSS Fundamentals'],
        },
        // Frontend: JavaScript & Browser APIs
        {
            domain: 'Frontend Development',
            module: 'JavaScript & Browser APIs',
            name: 'JavaScript Basics',
            level: 'Beginner',
            estimatedHours: 8,
            description: 'Understand variables, functions, loops, and basic data structures.',
            prerequisites: ['HTML Basics'],
        },
        {
            domain: 'Frontend Development',
            module: 'JavaScript & Browser APIs',
            name: 'DOM Manipulation',
            level: 'Intermediate',
            estimatedHours: 6,
            description: 'Use the DOM API to update and respond to user interactions.',
            prerequisites: ['JavaScript Basics'],
        },
        {
            domain: 'Frontend Development',
            module: 'JavaScript & Browser APIs',
            name: 'Async JavaScript & Fetch API',
            level: 'Intermediate',
            estimatedHours: 6,
            description: 'Work with promises, async/await, and remote APIs.',
            prerequisites: ['JavaScript Basics'],
        },
        // Frontend: React Fundamentals
        {
            domain: 'Frontend Development',
            module: 'React Fundamentals',
            name: 'React Components & JSX',
            level: 'Intermediate',
            estimatedHours: 8,
            description: 'Build UI with components, props, and JSX syntax.',
            prerequisites: ['JavaScript Basics'],
        },
        {
            domain: 'Frontend Development',
            module: 'React Fundamentals',
            name: 'React State & Effects',
            level: 'Intermediate',
            estimatedHours: 8,
            description: 'Manage component state and side effects with hooks.',
            prerequisites: ['React Components & JSX'],
        },
        {
            domain: 'Frontend Development',
            module: 'React Fundamentals',
            name: 'Routing & State Management',
            level: 'Advanced',
            estimatedHours: 10,
            description: 'Handle navigation and shared state across your app.',
            prerequisites: ['React State & Effects'],
        },
        // Backend: Node.js Fundamentals
        {
            domain: 'Backend Development',
            module: 'Node.js Fundamentals',
            name: 'Node.js Runtime & Module System',
            level: 'Beginner',
            estimatedHours: 5,
            description: 'Understand Node.js runtime, modules, and package management.',
            prerequisites: [],
        },
        {
            domain: 'Backend Development',
            module: 'Node.js Fundamentals',
            name: 'Asynchronous Patterns',
            level: 'Intermediate',
            estimatedHours: 6,
            description: 'Work with callbacks, promises, and async/await in Node.',
            prerequisites: ['Node.js Runtime & Module System'],
        },
        // Backend: Databases & Storage
        {
            domain: 'Backend Development',
            module: 'Databases & Storage',
            name: 'Relational vs NoSQL',
            level: 'Beginner',
            estimatedHours: 4,
            description: 'Compare relational and NoSQL databases and when to use each.',
            prerequisites: [],
        },
        {
            domain: 'Backend Development',
            module: 'Databases & Storage',
            name: 'MongoDB & Mongoose Basics',
            level: 'Intermediate',
            estimatedHours: 6,
            description: 'Model data and interact with MongoDB using Mongoose.',
            prerequisites: ['Relational vs NoSQL'],
        },
        // Backend: API Development with Express
        {
            domain: 'Backend Development',
            module: 'API Development with Express',
            name: 'Express Routing & Middleware',
            level: 'Intermediate',
            estimatedHours: 6,
            description: 'Build REST endpoints and use middleware in Express.',
            prerequisites: ['Node.js Runtime & Module System'],
        },
        {
            domain: 'Backend Development',
            module: 'API Development with Express',
            name: 'Error Handling & Validation',
            level: 'Intermediate',
            estimatedHours: 5,
            description: 'Validate input and handle errors gracefully in APIs.',
            prerequisites: ['Express Routing & Middleware'],
        },
        // Backend: Authentication & Security
        {
            domain: 'Backend Development',
            module: 'Authentication & Security',
            name: 'Hashing & JWT',
            level: 'Intermediate',
            estimatedHours: 5,
            description: 'Secure user credentials and issue JSON Web Tokens.',
            prerequisites: ['Express Routing & Middleware'],
        },
        {
            domain: 'Backend Development',
            module: 'Authentication & Security',
            name: 'OWASP API Security Basics',
            level: 'Advanced',
            estimatedHours: 6,
            description: 'Mitigate common web and API vulnerabilities.',
            prerequisites: ['Hashing & JWT'],
        },
        // Data Science: Python for Data Analysis
        {
            domain: 'Data Science',
            module: 'Python for Data Analysis',
            name: 'Python Fundamentals',
            level: 'Beginner',
            estimatedHours: 6,
            description: 'Get comfortable with Python syntax and data structures.',
            prerequisites: [],
        },
        {
            domain: 'Data Science',
            module: 'Python for Data Analysis',
            name: 'NumPy & Pandas',
            level: 'Intermediate',
            estimatedHours: 8,
            description: 'Manipulate arrays and dataframes for analysis.',
            prerequisites: ['Python Fundamentals'],
        },
        // Data Science: EDA
        {
            domain: 'Data Science',
            module: 'Exploratory Data Analysis',
            name: 'Data Cleaning',
            level: 'Intermediate',
            estimatedHours: 5,
            description: 'Handle missing data, outliers, and inconsistent formats.',
            prerequisites: ['NumPy & Pandas'],
        },
        {
            domain: 'Data Science',
            module: 'Exploratory Data Analysis',
            name: 'Data Visualization',
            level: 'Intermediate',
            estimatedHours: 5,
            description: 'Visualize data using Matplotlib and Seaborn.',
            prerequisites: ['NumPy & Pandas'],
        },
        // Data Science: ML Basics
        {
            domain: 'Data Science',
            module: 'Machine Learning Basics',
            name: 'Supervised Learning',
            level: 'Intermediate',
            estimatedHours: 8,
            description: 'Train and evaluate regression and classification models.',
            prerequisites: ['Data Cleaning'],
        },
        {
            domain: 'Data Science',
            module: 'Machine Learning Basics',
            name: 'Model Evaluation',
            level: 'Advanced',
            estimatedHours: 6,
            description: 'Use appropriate metrics and cross-validation.',
            prerequisites: ['Supervised Learning'],
        },
        // Cybersecurity
        {
            domain: 'Cybersecurity',
            module: 'Security Fundamentals',
            name: 'Security Principles',
            level: 'Beginner',
            estimatedHours: 4,
            description: 'Understand CIA triad, least privilege, and defense in depth.',
            prerequisites: [],
        },
        {
            domain: 'Cybersecurity',
            module: 'Web Application Security',
            name: 'OWASP Top 10',
            level: 'Intermediate',
            estimatedHours: 6,
            description: 'Study the most critical web application security risks.',
            prerequisites: ['Security Principles'],
        },
        {
            domain: 'Cybersecurity',
            module: 'Network & System Security',
            name: 'Network Security Basics',
            level: 'Intermediate',
            estimatedHours: 6,
            description: 'Secure networks with firewalls, VPNs, and segmentation.',
            prerequisites: ['Security Principles'],
        },
        // DevOps & Cloud
        {
            domain: 'DevOps & Cloud',
            module: 'Version Control & CI',
            name: 'Git & GitHub',
            level: 'Beginner',
            estimatedHours: 4,
            description: 'Track code changes and collaborate using Git.',
            prerequisites: [],
        },
        {
            domain: 'DevOps & Cloud',
            module: 'Version Control & CI',
            name: 'Continuous Integration Basics',
            level: 'Intermediate',
            estimatedHours: 5,
            description: 'Automate builds and tests with CI pipelines.',
            prerequisites: ['Git & GitHub'],
        },
        {
            domain: 'DevOps & Cloud',
            module: 'Containers & Orchestration',
            name: 'Docker Fundamentals',
            level: 'Intermediate',
            estimatedHours: 6,
            description: 'Containerize applications using Docker images and containers.',
            prerequisites: ['Git & GitHub'],
        },
        {
            domain: 'DevOps & Cloud',
            module: 'Containers & Orchestration',
            name: 'Kubernetes Basics',
            level: 'Advanced',
            estimatedHours: 8,
            description: 'Deploy and scale containerized apps with Kubernetes.',
            prerequisites: ['Docker Fundamentals'],
        },
        // Mobile App Development
        {
            domain: 'Mobile App Development',
            module: 'Mobile UI Fundamentals',
            name: 'Layouts & Navigation',
            level: 'Beginner',
            estimatedHours: 5,
            description: 'Build basic mobile screens and navigation flows.',
            prerequisites: [],
        },
        {
            domain: 'Mobile App Development',
            module: 'Cross-Platform Development',
            name: 'React Native Basics',
            level: 'Intermediate',
            estimatedHours: 8,
            description: 'Use React Native components to build cross-platform apps.',
            prerequisites: ['Layouts & Navigation'],
        },
        {
            domain: 'Mobile App Development',
            module: 'State Management & APIs',
            name: 'State Management',
            level: 'Intermediate',
            estimatedHours: 6,
            description: 'Manage local and global state in mobile apps.',
            prerequisites: ['React Native Basics'],
        },
        {
            domain: 'Mobile App Development',
            module: 'State Management & APIs',
            name: 'API Integration',
            level: 'Intermediate',
            estimatedHours: 6,
            description: 'Connect mobile apps to REST APIs and handle responses.',
            prerequisites: ['React Native Basics'],
        },
    ];

    // Insert skills without prerequisites first, so we can resolve IDs after
    const skillsToInsert = skillsDefinitions.map((s) => {
        const moduleDoc = moduleByKey[`${s.domain}::${s.module}`];
        return {
            name: s.name,
            description: s.description,
            domain: s.domain,
            moduleId: moduleDoc?._id,
            level: s.level,
            estimatedHours: s.estimatedHours,
            prerequisites: [],
        };
    });

    const skillDocs = await Skill.insertMany(skillsToInsert);

    const skillByKey = {};
    skillDocs.forEach((doc) => {
        skillByKey[`${doc.domain}::${doc.name}`] = doc;
    });

    // Now update prerequisites as Skill ObjectId references
    for (const def of skillsDefinitions) {
        if (!def.prerequisites || def.prerequisites.length === 0) continue;
        const skillDoc = skillByKey[`${def.domain}::${def.name}`];
        if (!skillDoc) continue;
        const prereqIds = def.prerequisites
            .map((name) => skillByKey[`${def.domain}::${name}`])
            .filter(Boolean)
            .map((doc) => doc._id);
        skillDoc.prerequisites = prereqIds;
        await skillDoc.save();
    }

    // 4️⃣ Resources
    console.log('Creating resources...');
    const resourcesToInsert = [
        // Frontend HTML & CSS
        {
            skill: 'Frontend Development::HTML Basics',
            title: 'MDN Web Docs: HTML Introduction',
            type: 'documentation',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML',
            difficulty: 'Beginner',
            rating: 5,
        },
        {
            skill: 'Frontend Development::HTML Basics',
            title: 'HTML Crash Course for Beginners (YouTube)',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
            difficulty: 'Beginner',
            rating: 4.7,
        },
        {
            skill: 'Frontend Development::Semantic HTML',
            title: 'MDN: HTML Elements Reference',
            type: 'documentation',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element',
            difficulty: 'Beginner',
            rating: 4.8,
        },
        {
            skill: 'Frontend Development::CSS Fundamentals',
            title: 'MDN: CSS First Steps',
            type: 'documentation',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps',
            difficulty: 'Beginner',
            rating: 5,
        },
        {
            skill: 'Frontend Development::Flexbox & Grid',
            title: 'CSS-Tricks: A Complete Guide to Flexbox',
            type: 'documentation',
            url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
            difficulty: 'Intermediate',
            rating: 4.9,
        },
        {
            skill: 'Frontend Development::JavaScript Basics',
            title: 'freeCodeCamp JavaScript Algorithms and Data Structures',
            type: 'tutorial',
            url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
            difficulty: 'Beginner',
            rating: 5,
        },
        {
            skill: 'Frontend Development::DOM Manipulation',
            title: 'MDN: Document Object Model (DOM)',
            type: 'documentation',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model',
            difficulty: 'Intermediate',
            rating: 4.7,
        },
        {
            skill: 'Frontend Development::React Components & JSX',
            title: 'React Official Docs: Main Concepts',
            type: 'documentation',
            url: 'https://react.dev/learn',
            difficulty: 'Intermediate',
            rating: 5,
        },
        // Backend
        {
            skill: 'Backend Development::Node.js Runtime & Module System',
            title: 'Node.js Official Docs: Getting Started',
            type: 'documentation',
            url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
            difficulty: 'Beginner',
            rating: 4.8,
        },
        {
            skill: 'Backend Development::Express Routing & Middleware',
            title: 'Express.js Guide: Routing',
            type: 'documentation',
            url: 'https://expressjs.com/en/guide/routing.html',
            difficulty: 'Intermediate',
            rating: 4.8,
        },
        {
            skill: 'Backend Development::MongoDB & Mongoose Basics',
            title: 'Mongoose Docs: Getting Started',
            type: 'documentation',
            url: 'https://mongoosejs.com/docs/index.html',
            difficulty: 'Intermediate',
            rating: 4.6,
        },
        // Data Science
        {
            skill: 'Data Science::Python Fundamentals',
            title: 'Python.org: Official Tutorial',
            type: 'documentation',
            url: 'https://docs.python.org/3/tutorial/',
            difficulty: 'Beginner',
            rating: 4.7,
        },
        {
            skill: 'Data Science::NumPy & Pandas',
            title: 'freeCodeCamp: Data Analysis with Python',
            type: 'tutorial',
            url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
            difficulty: 'Intermediate',
            rating: 4.9,
        },
        {
            skill: 'Data Science::Data Visualization',
            title: 'Seaborn Tutorial',
            type: 'documentation',
            url: 'https://seaborn.pydata.org/tutorial.html',
            difficulty: 'Intermediate',
            rating: 4.6,
        },
        // Cybersecurity
        {
            skill: 'Cybersecurity::Security Principles',
            title: 'OWASP: Security by Design Principles',
            type: 'documentation',
            url: 'https://owasp.org/www-project-security-by-design/',
            difficulty: 'Beginner',
            rating: 4.5,
        },
        {
            skill: 'Cybersecurity::OWASP Top 10',
            title: 'OWASP Top 10 Web Application Security Risks',
            type: 'documentation',
            url: 'https://owasp.org/www-project-top-ten/',
            difficulty: 'Intermediate',
            rating: 5,
        },
        // DevOps & Cloud
        {
            skill: 'DevOps & Cloud::Git & GitHub',
            title: 'Pro Git Book (Online)',
            type: 'documentation',
            url: 'https://git-scm.com/book/en/v2',
            difficulty: 'Beginner',
            rating: 4.8,
        },
        {
            skill: 'DevOps & Cloud::Docker Fundamentals',
            title: 'Docker Docs: Get Started',
            type: 'documentation',
            url: 'https://docs.docker.com/get-started/',
            difficulty: 'Intermediate',
            rating: 4.7,
        },
        // Mobile
        {
            skill: 'Mobile App Development::React Native Basics',
            title: 'React Native Docs: Getting Started',
            type: 'documentation',
            url: 'https://reactnative.dev/docs/environment-setup',
            difficulty: 'Intermediate',
            rating: 4.7,
        },
        {
            skill: 'Mobile App Development::API Integration',
            title: 'React Native Networking',
            type: 'documentation',
            url: 'https://reactnative.dev/docs/network',
            difficulty: 'Intermediate',
            rating: 4.5,
        },
    ];

    const resourcesDocs = resourcesToInsert
        .map((r) => {
            const skillDoc = skillByKey[r.skill];
            if (!skillDoc) return null;
            return {
                skillId: skillDoc._id,
                title: r.title,
                type: r.type,
                url: r.url,
                difficulty: r.difficulty,
                rating: r.rating,
            };
        })
        .filter(Boolean);

    await Resource.insertMany(resourcesDocs);

    console.log('Data Imported!');
    console.log('The DPR knowledge base now contains multiple domains, modules, skills, and resources.');
    process.exit();
};

seedData().catch((err) => {
    console.error(err);
    process.exit(1);
});
