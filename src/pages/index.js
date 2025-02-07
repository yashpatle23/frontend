import { useRouter } from "next/router";

export default function AuthLanding() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to Healthcare System</h1>

      <div className="grid grid-cols-2 gap-6">
        <button onClick={() => router.push('/auth/login?role=patient')} className="px-6 py-3 bg-blue-500 text-white rounded-lg">Login as Patient</button>
        <button onClick={() => router.push('/auth/login?role=doctor')} className="px-6 py-3 bg-green-500 text-white rounded-lg">Login as Doctor</button>
        
        <button onClick={() => router.push('/auth/register?role=patient')} className="px-6 py-3 bg-blue-700 text-white rounded-lg">Register as Patient</button>
        <button onClick={() => router.push('/auth/register?role=doctor')} className="px-6 py-3 bg-green-700 text-white rounded-lg">Register as Doctor</button>
      </div>
    </div>
  );
}
