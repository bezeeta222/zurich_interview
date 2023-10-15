"use client";

import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";

const Home = () => {
  const { data: session, status } = useSession(); // Get the user session
  const router = useRouter();

  // console.log("session", session?.user);
  console.log("status", status);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    router.push("/user");

    return <p>Access Denied</p>;
  }

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

export default Home;
