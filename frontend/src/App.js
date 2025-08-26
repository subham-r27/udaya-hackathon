import React, { useState, useMemo } from 'react';
import axios from 'axios';

// --- RegistrationForm Component ---
// This component is now defined in the same file as App for simplicity.
// It is no longer exported as default.

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-semibold text-orange-400 border-l-4 border-orange-500 pl-4 mb-6">{children}</h2>
);

const InputField = ({ id, name, label, type = 'text', value, onChange, required = true }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
    />
  </div>
);

const SelectField = ({ id, name, label, value, onChange, options, required = true }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
        >
            <option value="">Select an option</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

const ParticipantForm = ({ id, participant, setParticipant, title, required }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setParticipant(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField id={`${id}-name`} name="name" label={`${title} Name`} value={participant.name} onChange={handleChange} required={required} />
            <InputField id={`${id}-email`} name="email" label="Email" type="email" value={participant.email} onChange={handleChange} required={required} />
            <InputField id={`${id}-phone`} name="phone_number" label="Phone Number" value={participant.phone_number} onChange={handleChange} required={required} />
            <InputField id={`${id}-college`} name="college_name" label="College Name" value={participant.college_name} onChange={handleChange} required={required} />
            <SelectField
                id={`${id}-year`}
                name="year_of_passing"
                label="Year of Passing"
                value={participant.year_of_passing}
                onChange={handleChange}
                options={[
                    { value: '2026', label: '2026' },
                    { value: '2027', label: '2027' },
                    { value: '2028', label: '2028' },
                ]}
                required={required}
            />
            <InputField id={`${id}-linkedin`} name="linkedin_url" label="LinkedIn URL" value={participant.linkedin_url} onChange={handleChange} required={false} />
            <InputField id={`${id}-github`} name="github_url" label="GitHub URL" value={participant.github_url} onChange={handleChange} required={false} />
        </div>
    );
};


const RegistrationForm = () => {
    const initialParticipantState = { name: '', email: '', phone_number: '', linkedin_url: '', github_url: '', year_of_passing: '', college_name: '' };
    
    const [teamName, setTeamName] = useState('');
    const [topic, setTopic] = useState('');
    const [ideaPdf, setIdeaPdf] = useState(null);
    const [leader, setLeader] = useState({ ...initialParticipantState });
    const [participant2, setParticipant2] = useState({ ...initialParticipantState });
    const [participant3, setParticipant3] = useState({ ...initialParticipantState });
    const [participant4, setParticipant4] = useState({ ...initialParticipantState });
    
    const [status, setStatus] = useState({ loading: false, error: null, success: null });

    const topicOptions = [
        { value: 'Speculative / Future Design', label: 'Speculative / Future Design' },
        { value: 'Immersive Interaction Design (AR/VR/XR)', label: 'Immersive Interaction Design (AR/VR/XR)' },
        { value: 'AI in Education', label: 'AI in Education' },
        { value: 'AI in Agriculture', label: 'AI in Agriculture' },
        { value: 'AI in Healthcare', label: 'AI in Healthcare' },
    ];

    const totalFields = 2 + (7 * 3) + 1; // Team name, topic, 3 required participants, pdf
    const filledFields = useMemo(() => {
        let count = 0;
        if (teamName) count++;
        if (topic) count++;
        if (ideaPdf) count++;
        
        const countParticipantFields = (p) => {
            let pCount = 0;
            if (p.name) pCount++;
            if (p.email) pCount++;
            if (p.phone_number) pCount++;
            if (p.college_name) pCount++;
            if (p.year_of_passing) pCount++;
            if (p.linkedin_url) pCount++;
            if (p.github_url) pCount++;
            return pCount;
        };
        
        count += countParticipantFields(leader);
        count += countParticipantFields(participant2);
        count += countParticipantFields(participant3);
        // Optional participant 4 also contributes to the progress bar if filled
        if (participant4.name) {
             count += countParticipantFields(participant4);
        }

        // Adjust total fields if optional participant is filled
        const currentTotal = participant4.name ? totalFields + 7 : totalFields;

        return { count, total: currentTotal };
    }, [teamName, topic, ideaPdf, leader, participant2, participant3, participant4, totalFields]);

    const completionPercentage = Math.round((filledFields.count / filledFields.total) * 100);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: null });

        const formData = new FormData();
        formData.append('team_name', teamName);
        formData.append('topic', topic);
        formData.append('idea_submission_pdf', ideaPdf);

        const appendParticipant = (prefix, participant) => {
            Object.keys(participant).forEach(key => {
                formData.append(`${prefix}.${key}`, participant[key]);
            });
        };

        appendParticipant('leader', leader);
        appendParticipant('participant_2', participant2);
        appendParticipant('participant_3', participant3);
        
        // Only include optional participant 4 if their name is filled
        if (participant4.name) appendParticipant('participant_4', participant4);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStatus({ loading: false, error: null, success: 'Registration successful!' });
        } catch (error) {
            console.error("Registration error:", error.response ? error.response.data : error.message);
            setStatus({ loading: false, error: 'Registration failed. Please check your input and try again.', success: null });
        }
    };
    


    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-4xl mx-auto">
            
            {/* Progress Bar */}
            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-200">Registration Progress</h3>
                <div className="mt-2 bg-gray-700 rounded-full h-4">
                    <div
                        className="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>
                <p className="text-right text-sm text-orange-400 mt-1">{completionPercentage}% Complete</p>
            </div>

            <div className="space-y-12">
                <div>
                    <SectionTitle>Team Information *</SectionTitle>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <InputField id="teamName" name="team_name" label="Team Name" value={teamName} onChange={e => setTeamName(e.target.value)} />
                        <SelectField id="topic" name="topic" label="Select a Topic" value={topic} onChange={e => setTopic(e.target.value)} options={topicOptions} />
                    </div>
                     <div className="mt-4">
                        <label htmlFor="ideaPdf" className="block text-sm font-medium text-gray-300 mb-1">Idea Submission (PPT as PDF) *</label>
                        <input
                            type="file"
                            id="ideaPdf"
                            name="idea_submission_pdf"
                            accept=".pdf"
                            onChange={e => setIdeaPdf(e.target.files[0])}
                            required
                            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        />
                    </div>
                </div>

                <div>
                    <SectionTitle>Team Leader *</SectionTitle>
                    <ParticipantForm id="leader" participant={leader} setParticipant={setLeader} title="Leader" required={true} />
                </div>

                <div>
                    <SectionTitle>Participant 2 *</SectionTitle>
                    <ParticipantForm id="p2" participant={participant2} setParticipant={setParticipant2} title="Participant 2" required={true} />
                </div>

                <div>
                    <SectionTitle>Participant 3 *</SectionTitle>
                    <ParticipantForm id="p3" participant={participant3} setParticipant={setParticipant3} title="Participant 3" required={true} />
                </div>

                <div>
                    <SectionTitle>Participant 4 <span className="text-sm text-gray-500">(Optional)</span></SectionTitle>
                    <ParticipantForm id="p4" participant={participant4} setParticipant={setParticipant4} title="Participant 4" required={false} />
                </div>
            </div>

            <div className="mt-12">
                {status.error && <p className="text-red-400 text-center mb-4">{status.error}</p>}
                {status.success && <p className="text-green-400 text-center mb-4">{status.success}</p>}
                <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status.loading ? 'Registering...' : 'Register Team'}
                </button>
            </div>
        </form>
    );
};


// --- App Component ---
// This is the main component for the application.
function App() {
  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white antialiased">
      <header className="py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
          Udaya 1.0 Hackathon
        </h1>
        <p className="text-gray-400 mt-2">Ignite Your Innovation</p>
      </header>
      <main className="container mx-auto px-4 pb-12">
        <RegistrationForm />
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>&copy; 2025 Udaya Hackathon. All rights reserved.</p>
      </footer>
    </div>
  );
}

// This is now the only default export in the file.
export default App;
