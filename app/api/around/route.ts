import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  console.log(`API route called at ${new Date().toISOString()}`);
  console.log(`Full URL: ${req.url}`);

  const fid = req.nextUrl.searchParams.get("fid");
  console.log(`Requested fid: ${fid}`);

  if (!fid) {
    console.log("Error: fid parameter is missing");
    return NextResponse.json(
      { error: "fid parameter is required" },
      { status: 400 }
    );
  }

  const fidNum = parseInt(fid);
  if (isNaN(fidNum)) {
    return NextResponse.json(
      { error: "Invalid fid parameter, must be a number" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching data from API for fid: ${fidNum}`);

    // Determine the value of nfid based on fidNum
    const nfid = fidNum < 17 ? 1 : fidNum - 8;

    // Array to hold the details for the next 17 fid values
    const userDetailsPromises = [];
    
    // Loop through the next 17 fid values and fetch their details
    for (let i = 0; i < 17; i++) {
      const currentFid = nfid + i;
      const apiUrl = `https://api.warpcast.com/v2/user?fid=${currentFid}`;
      userDetailsPromises.push(
        axios
          .get(apiUrl)
          .then((response) => {
            const user = response.data.result.user;
            if (!user) {
              return {
                fid: currentFid,
                error: "No user data found for this fid",
              };
            }

            const { fid: userFid, username, displayName, pfp } = user;
            let pfpUrl = pfp?.url || null;

            // If fid < 17, set pfpUrl to null for index 9
            if (currentFid < 17 && i === 9) {
              pfpUrl = null;
            }

            return {
              fid: userFid,
              username,
              displayName,
              pfp: { url: pfpUrl },
            };
          })
          .catch((error) => {
            console.error(`Error fetching data for fid ${currentFid}:`, error);
            return {
              fid: currentFid,
              error: "An unexpected error occurred",
            };
          })
      );
    }

    // Wait for all the API calls to finish
    const userDetails = await Promise.all(userDetailsPromises);

    // console.log("Fetched user details:", userDetails);
    console.log("hehe")
    // console.log(userDetails[6]?.fid )

    return NextResponse.json(userDetails);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
