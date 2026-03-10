import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { useUser } from '../context/useUser';
import {
    createDomain,
    createModule,
    createResource,
    createSkill,
    getAdminOverview,
} from '../services/api';

const initialDomainForm = {
    name: '',
    description: '',
    icon: '',
    technologies: '',
};

const initialModuleForm = {
    domainId: '',
    name: '',
    description: '',
    order: 1,
};

const initialSkillForm = {
    moduleId: '',
    name: '',
    description: '',
    level: 'Beginner',
    estimatedHours: 4,
};

const initialResourceForm = {
    skillId: '',
    title: '',
    type: 'documentation',
    url: '',
    difficulty: 'Beginner',
    rating: 4,
};

const AdminCreateDomain = () => {
    const { loading: userLoading, user, isAdmin } = useUser();
    const [overview, setOverview] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [submitting, setSubmitting] = useState('');
    const [domainForm, setDomainForm] = useState(initialDomainForm);
    const [moduleForm, setModuleForm] = useState(initialModuleForm);
    const [skillForm, setSkillForm] = useState(initialSkillForm);
    const [resourceForm, setResourceForm] = useState(initialResourceForm);

    const modules = useMemo(
        () => overview.flatMap((domain) => (domain.modules || []).map((module) => ({
            ...module,
            domainName: domain.name,
        }))),
        [overview]
    );

    const skills = useMemo(
        () => modules.flatMap((module) => (module.skills || []).map((skill) => ({
            ...skill,
            moduleName: module.name,
            domainName: module.domainName,
        }))),
        [modules]
    );

    const loadOverview = async () => {
        try {
            const data = await getAdminOverview();
            setOverview(data || []);
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Unable to load admin data.' });
        }
    };

    useEffect(() => {
        loadOverview();
    }, []);

    useEffect(() => {
        if (!moduleForm.domainId && overview[0]?._id) {
            setModuleForm((prev) => ({ ...prev, domainId: overview[0]._id }));
        }
    }, [overview, moduleForm.domainId]);

    useEffect(() => {
        if (!skillForm.moduleId && modules[0]?._id) {
            setSkillForm((prev) => ({ ...prev, moduleId: modules[0]._id }));
        }
    }, [modules, skillForm.moduleId]);

    useEffect(() => {
        if (!resourceForm.skillId && skills[0]?._id) {
            setResourceForm((prev) => ({ ...prev, skillId: skills[0]._id }));
        }
    }, [skills, resourceForm.skillId]);

    const updateForm = (setter) => (event) => {
        const { name, value } = event.target;
        setter((prev) => ({ ...prev, [name]: value }));
    };

    const handleDomainSubmit = async (event) => {
        event.preventDefault();
        setSubmitting('domain');
        setMessage({ type: '', text: '' });

        try {
            await createDomain({
                ...domainForm,
                technologies: domainForm.technologies
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean),
            });
            setDomainForm(initialDomainForm);
            setMessage({ type: 'success', text: 'Domain created successfully.' });
            await loadOverview();
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to create domain.' });
        } finally {
            setSubmitting('');
        }
    };

    const handleModuleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting('module');
        setMessage({ type: '', text: '' });

        try {
            await createModule(moduleForm);
            setModuleForm((prev) => ({ ...initialModuleForm, domainId: prev.domainId || overview[0]?._id || '' }));
            setMessage({ type: 'success', text: 'Module created successfully.' });
            await loadOverview();
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to create module.' });
        } finally {
            setSubmitting('');
        }
    };

    const handleSkillSubmit = async (event) => {
        event.preventDefault();
        setSubmitting('skill');
        setMessage({ type: '', text: '' });

        try {
            await createSkill(skillForm);
            setSkillForm((prev) => ({ ...initialSkillForm, moduleId: prev.moduleId || modules[0]?._id || '' }));
            setMessage({ type: 'success', text: 'Skill created successfully.' });
            await loadOverview();
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to create skill.' });
        } finally {
            setSubmitting('');
        }
    };

    const handleResourceSubmit = async (event) => {
        event.preventDefault();
        setSubmitting('resource');
        setMessage({ type: '', text: '' });

        try {
            await createResource(resourceForm);
            setResourceForm((prev) => ({ ...initialResourceForm, skillId: prev.skillId || skills[0]?._id || '' }));
            setMessage({ type: 'success', text: 'Resource created successfully.' });
            await loadOverview();
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to create resource.' });
        } finally {
            setSubmitting('');
        }
    };

    if (userLoading) {
        return (
            <Layout>
                <div className="container">
                    <Loader />
                </div>
            </Layout>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <Layout>
            <div className="container">
                <header className="admin-panel-header">
                    <div>
                        <h1 className="page-title">Admin Panel</h1>
                        <p>
                            Admin work is content management: create domains, define modules, add skills, and attach
                            resources. Learner roadmap pages are intentionally hidden for admin accounts.
                        </p>
                    </div>
                    <div className="admin-overview-head">
                        <Button to="/admin/domains" variant="outline">
                            View Current Domains
                        </Button>
                        <Button to="/settings" variant="ghost">
                            View Profile
                        </Button>
                    </div>
                </header>

                {message.text && (
                    <div className={`admin-message ${message.type === 'error' ? 'error' : 'success'}`}>
                        {message.text}
                    </div>
                )}

                <section className="admin-panel">
                    <div className="admin-panel-stack">
                        <article className="card">
                            <h3>Create Domain</h3>
                            <p className="admin-subtitle">Add a new learning domain visible on the learner dashboard.</p>
                            <form className="admin-form-grid" onSubmit={handleDomainSubmit}>
                                <input className="form-control" name="name" placeholder="Domain name" value={domainForm.name} onChange={updateForm(setDomainForm)} required />
                                <textarea className="form-control" name="description" rows="4" placeholder="Description" value={domainForm.description} onChange={updateForm(setDomainForm)} required />
                                <input className="form-control" name="icon" placeholder="Icon or short label" value={domainForm.icon} onChange={updateForm(setDomainForm)} />
                                <input className="form-control" name="technologies" placeholder="Technologies, comma-separated" value={domainForm.technologies} onChange={updateForm(setDomainForm)} />
                                <Button type="submit" variant="primary" disabled={submitting === 'domain'}>
                                    {submitting === 'domain' ? 'Creating...' : 'Create Domain'}
                                </Button>
                            </form>
                        </article>

                        <article className="card">
                            <h3>Create Module</h3>
                            <p className="admin-subtitle">
                                You can create multiple modules for the same domain. Select a domain and add as many
                                modules as needed.
                            </p>
                            <form className="admin-form-grid" onSubmit={handleModuleSubmit}>
                                <select className="form-control" name="domainId" value={moduleForm.domainId} onChange={updateForm(setModuleForm)} required>
                                    <option value="">Select domain</option>
                                    {overview.map((domain) => (
                                        <option key={domain._id} value={domain._id}>{domain.name}</option>
                                    ))}
                                </select>
                                <input className="form-control" name="name" placeholder="Module name" value={moduleForm.name} onChange={updateForm(setModuleForm)} required />
                                <textarea className="form-control" name="description" rows="4" placeholder="Module description" value={moduleForm.description} onChange={updateForm(setModuleForm)} required />
                                <input className="form-control" name="order" type="number" min="1" placeholder="Display order" value={moduleForm.order} onChange={updateForm(setModuleForm)} />
                                <Button type="submit" variant="primary" disabled={submitting === 'module'}>
                                    {submitting === 'module' ? 'Creating...' : 'Create Module'}
                                </Button>
                            </form>
                        </article>

                        <article className="card">
                            <h3>Create Skill</h3>
                            <p className="admin-subtitle">Skills are the individual roadmap steps inside a module.</p>
                            <form className="admin-form-grid" onSubmit={handleSkillSubmit}>
                                <select className="form-control" name="moduleId" value={skillForm.moduleId} onChange={updateForm(setSkillForm)} required>
                                    <option value="">Select module</option>
                                    {modules.map((module) => (
                                        <option key={module._id} value={module._id}>{module.domainName} - {module.name}</option>
                                    ))}
                                </select>
                                <input className="form-control" name="name" placeholder="Skill name" value={skillForm.name} onChange={updateForm(setSkillForm)} required />
                                <textarea className="form-control" name="description" rows="4" placeholder="Skill description" value={skillForm.description} onChange={updateForm(setSkillForm)} required />
                                <select className="form-control" name="level" value={skillForm.level} onChange={updateForm(setSkillForm)} required>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                                <input className="form-control" name="estimatedHours" type="number" min="1" placeholder="Estimated hours" value={skillForm.estimatedHours} onChange={updateForm(setSkillForm)} />
                                <Button type="submit" variant="primary" disabled={submitting === 'skill'}>
                                    {submitting === 'skill' ? 'Creating...' : 'Create Skill'}
                                </Button>
                            </form>
                        </article>

                        <article className="card">
                            <h3>Create Resource</h3>
                            <p className="admin-subtitle">Attach videos, docs, or tutorials to a skill.</p>
                            <form className="admin-form-grid" onSubmit={handleResourceSubmit}>
                                <select className="form-control" name="skillId" value={resourceForm.skillId} onChange={updateForm(setResourceForm)} required>
                                    <option value="">Select skill</option>
                                    {skills.map((skill) => (
                                        <option key={skill._id} value={skill._id}>{skill.domainName} - {skill.moduleName} - {skill.name}</option>
                                    ))}
                                </select>
                                <input className="form-control" name="title" placeholder="Resource title" value={resourceForm.title} onChange={updateForm(setResourceForm)} required />
                                <select className="form-control" name="type" value={resourceForm.type} onChange={updateForm(setResourceForm)} required>
                                    <option value="documentation">Documentation</option>
                                    <option value="video">Video</option>
                                    <option value="tutorial">Tutorial</option>
                                </select>
                                <input className="form-control" name="url" placeholder="https://..." value={resourceForm.url} onChange={updateForm(setResourceForm)} required />
                                <select className="form-control" name="difficulty" value={resourceForm.difficulty} onChange={updateForm(setResourceForm)} required>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                                <input className="form-control" name="rating" type="number" min="0" max="5" step="0.1" value={resourceForm.rating} onChange={updateForm(setResourceForm)} />
                                <Button type="submit" variant="primary" disabled={submitting === 'resource'}>
                                    {submitting === 'resource' ? 'Creating...' : 'Create Resource'}
                                </Button>
                            </form>
                        </article>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default AdminCreateDomain;
