import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="bg-muted flex-col h-screen flex w-full flex-1 items-center justify-center p-6 md:p-10">
      <h1 className='text-4xl font-bold text-shadow-md py-4'>Log in to <span className="text-amber-500">Blo</span><span className="text-fuchsia-500">og</span></h1>
      <SignIn />
    </div>
  )
}
