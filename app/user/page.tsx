"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image"; // Import the Image component
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { useSession, getSession } from "next-auth/react"
import { useRouter } from 'next/navigation'



interface User {
  avatar: string | any;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const apiUrl = "/api/user";
const perPage = 4; // Number of users to display per page

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [showEmails, setShowEmails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter()


  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    router.push('/')

    return <p>Access Denied</p>
  }

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data);
      } else {
        console.error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const usersToDisplay = users.slice(startIndex, endIndex);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
        {usersToDisplay.map((user) => (
          <div
            key={user.id}
            className="max-w-sm rounded overflow-hidden shadow-lg"
          >
            <Image
              src={user.avatar}
              alt={`${user.first_name} ${user.last_name}`}
              width={200}
              height={200}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">
                {user.first_name} {user.last_name}
              </div>
              <p className="text-gray-700">
                {showEmails ? user.email : "Email Masked"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l "
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={endIndex >= users.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}
