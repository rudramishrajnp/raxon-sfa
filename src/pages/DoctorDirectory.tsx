import React, { useState } from 'react';
import { MapPin, User, Phone, Map } from 'lucide-react';

// Mock Data based on user requirements
const AREAS = [
  "Akbarpur 1",
  "Shahzadpur",
  "District Hospital",
  "Medical college",
  "Tanda",
  "Baskhari",
  "Jalalpur",
  "Malipur",
  "Dostpur",
  "Maharua",
  "Iltifatganj",
  "Akbarpur 2"
];

const MOCK_DOCTORS = [
  { id: 1, name: "Dr. A.K. Singh", area: "Jalalpur", subArea: "Jalalpur Market", specialty: "General Physician" },
  { id: 2, name: "Dr. R.K. Verma", area: "Jalalpur", subArea: "Jalalpur Chauraha", specialty: "Pediatrician" },
  { id: 3, name: "Dr. S.P. Gupta", area: "Shahzadpur", subArea: "Dostpur Mod", specialty: "Cardiologist" },
  { id: 4, name: "Dr. R.N. Yadav", area: "Shahzadpur", subArea: "Malipur Mod", specialty: "Orthopedic" },
  { id: 5, name: "Dr. Neha Sharma", area: "Medical college", subArea: "TFFF", specialty: "Gynecologist" },
  { id: 6, name: "Dr. M.L. Pandey", area: "District Hospital", subArea: "WRT", specialty: "General Surgeon" },
];

export default function DoctorDirectory() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const filteredDoctors = selectedArea 
    ? MOCK_DOCTORS.filter(d => d.area === selectedArea)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Doctor Directory</h1>
        <p className="text-gray-500">Manage doctors by Patch/Area</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Areas List */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-indigo-50 rounded-t-lg">
            <h2 className="font-semibold text-indigo-900 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Select Area (Patch)
            </h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {AREAS.map(area => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors ${selectedArea === area ? 'bg-indigo-100 font-semibold text-indigo-700' : 'text-gray-700'}`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors List */}
        <div className="md:col-span-2">
          {!selectedArea ? (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-12 flex flex-col items-center justify-center text-gray-500">
              <Map className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg">Select an Area from the list to view doctors.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg flex justify-between items-center">
                <h2 className="font-semibold text-gray-900 text-lg">Doctors in {selectedArea}</h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-medium">
                  {filteredDoctors.length} Doctors
                </span>
              </div>
              <div className="p-4">
                {filteredDoctors.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No doctors found in this area yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredDoctors.map(doctor => (
                      <div key={doctor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <User size={20} />
                            </div>
                            <div className="ml-3">
                              <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                              <p className="text-sm text-gray-500">{doctor.specialty}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 space-y-2">
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-2 text-gray-400" />
                            Sub-area: {doctor.subArea}
                          </div>
                          <div className="flex items-center">
                            <Phone size={16} className="mr-2 text-gray-400" />
                            +91 XXXXX XXXXX
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
