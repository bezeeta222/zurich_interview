import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const apiUrl = "https://reqres.in/api/users";

export async function GET(req: Request, res: Response) {
  const response = await fetch(apiUrl);

  const todos: any[] = await response.json();

  return NextResponse.json(todos);
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    // You can access the data from the request body like this:
    const { page, per_page } = requestData;

    if (page !== undefined && per_page !== undefined) {
      // Assuming you want to construct the URL with these parameters
      const apiUrlWithParams = `https://reqres.in/api/users?page=${page}&per_page=${per_page}`;

      // Fetch data from the constructed URL
      const response = await fetch(apiUrlWithParams);
      const data = await response.json();

      // Return the fetched data as a JSON response
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      return new Response(
        JSON.stringify({ error: "page and per_page parameters are required" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request data" }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
}
