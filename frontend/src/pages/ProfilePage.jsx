import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import TagInput from '../components/TagInput';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const MedicationForm = ({ med, onChange, onRemove }) => (
  <div className="glass-card-light p-4 space-y-3 relative">
    <button type="button" onClick={onRemove} className="absolute top-3 right-3 text-slate-500 hover:text-crimson-400 text-sm">✕</button>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="label">Medication Name</label>
        <input className="input-field" placeholder="e.g., Metformin" value={med.name}
          onChange={e => onChange({ ...med, name: e.target.value })} />
      </div>
      <div>
        <label className="label">Dosage</label>
        <input className="input-field" placeholder="e.g., 500mg" value={med.dosage}
          onChange={e => onChange({ ...med, dosage: e.target.value })} />
      </div>
      <div>
        <label className="label">Frequency</label>
        <input className="input-field" placeholder="e.g., Twice daily" value={med.frequency}
          onChange={e => onChange({ ...med, frequency: e.target.value })} />
      </div>
      <div>
        <label className="label">Prescribed For</label>
        <input className="input-field" placeholder="e.g., Diabetes" value={med.prescribedFor}
          onChange={e => onChange({ ...med, prescribedFor: e.target.value })} />
      </div>
    </div>
  </div>
);

const ContactForm = ({ contact, onChange, onRemove }) => (
  <div className="glass-card-light p-4 space-y-3 relative">
    <button type="button" onClick={onRemove} className="absolute top-3 right-3 text-slate-500 hover:text-crimson-400 text-sm">✕</button>
    <div className="flex items-center gap-2 mb-2">
      <input type="checkbox" id={`primary-${contact._id}`} checked={contact.isPrimary || false}
        onChange={e => onChange({ ...contact, isPrimary: e.target.checked })}
        className="accent-crimson-600" />
      <label htmlFor={`primary-${contact._id}`} className="text-slate-300 text-sm">Primary contact</label>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="label">Full Name</label>
        <input className="input-field" placeholder="Contact name" value={contact.name || ''}
          onChange={e => onChange({ ...contact, name: e.target.value })} />
      </div>
      <div>
        <label className="label">Relationship</label>
        <input className="input-field" placeholder="e.g., Spouse, Parent" value={contact.relationship || ''}
          onChange={e => onChange({ ...contact, relationship: e.target.value })} />
      </div>
      <div>
        <label className="label">Phone Number</label>
        <input className="input-field" placeholder="+1 (555) 000-0000" value={contact.phone || ''}
          onChange={e => onChange({ ...contact, phone: e.target.value })} />
      </div>
      <div>
        <label className="label">Email (optional)</label>
        <input className="input-field" placeholder="contact@email.com" value={contact.email || ''}
          onChange={e => onChange({ ...contact, email: e.target.value })} />
      </div>
    </div>
  </div>
);

export default function ProfilePage() {
  const { user, fetchUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const [form, setForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '', gender: '',
    bloodGroup: 'Unknown',
    allergies: [], conditions: [], medications: [],
    organDonor: false, dnrOrder: false,
    emergencyContacts: [],
    insuranceProvider: '', insurancePolicyNumber: '',
    primaryPhysician: { name: '', phone: '' },
    isProfilePublic: true, showInsurance: true, sosAlertEnabled: true,
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || 'Unknown',
        allergies: user.allergies || [],
        conditions: user.conditions || [],
        medications: user.medications || [],
        organDonor: user.organDonor || false,
        dnrOrder: user.dnrOrder || false,
        emergencyContacts: user.emergencyContacts || [],
        insuranceProvider: user.insuranceProvider || '',
        insurancePolicyNumber: user.insurancePolicyNumber || '',
        primaryPhysician: user.primaryPhysician || { name: '', phone: '' },
        isProfilePublic: user.isProfilePublic !== false,
        showInsurance: user.showInsurance !== false,
        sosAlertEnabled: user.sosAlertEnabled !== false,
      });
    }
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profile', form);
      await fetchUser();
      toast.success('Profile saved!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addMedication = () => setForm(p => ({
    ...p, medications: [...p.medications, { name: '', dosage: '', frequency: '', prescribedFor: '' }]
  }));

  const addContact = () => setForm(p => ({
    ...p, emergencyContacts: [...p.emergencyContacts, { name: '', relationship: '', phone: '', email: '', isPrimary: false }]
  }));

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'medical', label: 'Medical' },
    { id: 'medications', label: 'Medications' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">Health Profile</h1>
        <p className="text-slate-400 mt-1">This data appears on your emergency card when QR is scanned</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === t.id ? 'bg-crimson-600 text-white' : 'text-slate-400 hover:text-white'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={save}>
        {/* Personal Tab */}
        {activeTab === 'personal' && (
          <div className="glass-card p-6 space-y-4 animate-slide-up">
            <h2 className="font-display text-xl font-semibold text-white mb-2">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input className="input-field" value={form.firstName}
                  onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input className="input-field" value={form.lastName}
                  onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} required />
              </div>
              <div>
                <label className="label">Date of Birth</label>
                <input type="date" className="input-field" value={form.dateOfBirth}
                  onChange={e => setForm(p => ({ ...p, dateOfBirth: e.target.value }))} />
              </div>
              <div>
                <label className="label">Gender</label>
                <select className="input-field" value={form.gender}
                  onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}>
                  <option value="">Select gender</option>
                  {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Medical Tab */}
        {activeTab === 'medical' && (
          <div className="space-y-5 animate-slide-up">
            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold text-white mb-4">Blood & Critical Info</h2>
              <div className="mb-5">
                <label className="label">Blood Group</label>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_GROUPS.map(bg => (
                    <button key={bg} type="button"
                      onClick={() => setForm(p => ({ ...p, bloodGroup: bg }))}
                      className={`px-4 py-2 rounded-xl text-sm font-mono font-bold border transition-all ${
                        form.bloodGroup === bg
                          ? 'bg-crimson-600/30 border-crimson-500/50 text-crimson-400'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}>
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${form.organDonor ? 'bg-emerald-600' : 'bg-slate-700'}`}
                    onClick={() => setForm(p => ({ ...p, organDonor: !p.organDonor }))}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.organDonor ? 'left-5' : 'left-1'}`} />
                  </div>
                  <span className="text-slate-300 text-sm">Organ Donor</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${form.dnrOrder ? 'bg-amber-600' : 'bg-slate-700'}`}
                    onClick={() => setForm(p => ({ ...p, dnrOrder: !p.dnrOrder }))}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.dnrOrder ? 'left-5' : 'left-1'}`} />
                  </div>
                  <span className="text-slate-300 text-sm">DNR Order</span>
                </label>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold text-white mb-4">Allergies</h2>
              <p className="text-slate-500 text-xs mb-3">Press Enter or comma to add. Click to remove.</p>
              <TagInput value={form.allergies} onChange={v => setForm(p => ({ ...p, allergies: v }))}
                placeholder="e.g., Penicillin, Peanuts..." badgeClass="badge-allergy" />
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold text-white mb-4">Medical Conditions</h2>
              <p className="text-slate-500 text-xs mb-3">Press Enter or comma to add. Click to remove.</p>
              <TagInput value={form.conditions} onChange={v => setForm(p => ({ ...p, conditions: v }))}
                placeholder="e.g., Diabetes, Hypertension..." badgeClass="badge-condition" />
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold text-white mb-4">Primary Physician</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Doctor's Name</label>
                  <input className="input-field" placeholder="Dr. Jane Smith"
                    value={form.primaryPhysician?.name || ''}
                    onChange={e => setForm(p => ({ ...p, primaryPhysician: { ...p.primaryPhysician, name: e.target.value } }))} />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input-field" placeholder="+1 (555) 000-0000"
                    value={form.primaryPhysician?.phone || ''}
                    onChange={e => setForm(p => ({ ...p, primaryPhysician: { ...p.primaryPhysician, phone: e.target.value } }))} />
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-xl font-semibold text-white mb-4">Insurance</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Insurance Provider</label>
                  <input className="input-field" placeholder="e.g., Blue Cross"
                    value={form.insuranceProvider}
                    onChange={e => setForm(p => ({ ...p, insuranceProvider: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Policy Number</label>
                  <input className="input-field" placeholder="Policy number"
                    value={form.insurancePolicyNumber}
                    onChange={e => setForm(p => ({ ...p, insurancePolicyNumber: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-white">Current Medications</h2>
                <p className="text-slate-400 text-sm mt-1">Add all medications you currently take</p>
              </div>
              <button type="button" onClick={addMedication} className="btn-secondary py-2 px-4 text-sm">
                + Add Medication
              </button>
            </div>

            {form.medications.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-4xl mb-3">💊</div>
                <p className="text-slate-400">No medications added yet</p>
                <button type="button" onClick={addMedication} className="btn-primary mt-4 py-2 px-5 text-sm mx-auto">
                  Add First Medication
                </button>
              </div>
            ) : (
              form.medications.map((med, i) => (
                <MedicationForm key={i} med={med}
                  onChange={updated => setForm(p => ({
                    ...p, medications: p.medications.map((m, j) => j === i ? updated : m)
                  }))}
                  onRemove={() => setForm(p => ({ ...p, medications: p.medications.filter((_, j) => j !== i) }))}
                />
              ))
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-white">Emergency Contacts</h2>
                <p className="text-slate-400 text-sm mt-1">People to notify in an emergency</p>
              </div>
              <button type="button" onClick={addContact} className="btn-secondary py-2 px-4 text-sm">
                + Add Contact
              </button>
            </div>

            {form.emergencyContacts.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-4xl mb-3">👥</div>
                <p className="text-slate-400">No emergency contacts added</p>
                <button type="button" onClick={addContact} className="btn-primary mt-4 py-2 px-5 text-sm mx-auto">
                  Add First Contact
                </button>
              </div>
            ) : (
              form.emergencyContacts.map((c, i) => (
                <ContactForm key={i} contact={c}
                  onChange={updated => setForm(p => ({
                    ...p, emergencyContacts: p.emergencyContacts.map((x, j) => j === i ? updated : x)
                  }))}
                  onRemove={() => setForm(p => ({ ...p, emergencyContacts: p.emergencyContacts.filter((_, j) => j !== i) }))}
                />
              ))
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="glass-card p-6 space-y-5 animate-slide-up">
            <h2 className="font-display text-xl font-semibold text-white mb-2">Privacy & Settings</h2>
            {[
              { key: 'isProfilePublic', label: 'Public Profile', desc: 'Allow QR code to show your health data' },
              { key: 'showInsurance', label: 'Show Insurance', desc: 'Show insurance info on emergency page' },
              { key: 'sosAlertEnabled', label: 'SOS Alerts', desc: 'Allow SOS button to alert your contacts' },
            ].map(s => (
              <div key={s.key} className="flex items-center justify-between py-3 border-b border-slate-700/40 last:border-0">
                <div>
                  <p className="text-white font-medium">{s.label}</p>
                  <p className="text-slate-400 text-sm">{s.desc}</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${form[s.key] ? 'bg-crimson-600' : 'bg-slate-700'}`}
                  onClick={() => setForm(p => ({ ...p, [s.key]: !p[s.key] }))}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form[s.key] ? 'left-7' : 'left-1'}`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save button - always visible */}
        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary py-3 px-8">
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : '✓ Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
