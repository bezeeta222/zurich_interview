"use client";

import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/router"; // Import the useRouter hook
import Homes from "./home/page";

const Home = () => {
  const { data: session } = useSession(); // Get the user session

  return <Homes />;
};

export default Home;
