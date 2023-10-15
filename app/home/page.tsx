"use client";

import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/router"; // Import the useRouter hook

const Homes = () => {
  const { data: session } = useSession(); // Get the user session

  return (
    <section className="w-full flex-center flex-col mt-20">
      <h1 className="head_text text-center">
        Interview Assessment
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center"> ZURICH</span>
      </h1>

      <p className="text-center m-10">Please sign in to access your account.</p>
    </section>
  );
};

export default Homes;
