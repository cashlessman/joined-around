import { Button } from "frames.js/next";
import { frames, ImageAspectRatio } from "./frames";

import { appURL, formatNumber } from "../utils";

interface State {
  lastFid?: string;
}

const frameHandler = frames(async (ctx) => {
  interface UserData {
    name: string;
    username: string;
    fid: string;
    userCreatedAt:string;
    profileDisplayName: string;
    profileImageUrl: string;
  }

  interface User {
    fid: number;
    username: string;
    displayName: string;
    pfp: { url: string };  // Profile picture URL
  }
  interface AroundResponse {
    data: User[]; 
  
  }

  let userData: UserData | undefined;
  // let data: AroundResponse;
  let data: AroundResponse | null = null;


  let error: string | null = null;
  let isLoading = false;

  const fetchUserData = async (fid: string) => {
    isLoading = true;
    try {
      const airstackUrl = `${appURL()}/api/profile?userId=${encodeURIComponent(
        fid
      )}`;
      const airstackResponse = await fetch(airstackUrl);
      if (!airstackResponse.ok) {
        throw new Error(
          `Airstack HTTP error! status: ${airstackResponse.status}`
        );
      }
      const airstackData = await airstackResponse.json();
      if (
        airstackData.userData.Socials.Social &&
        airstackData.userData.Socials.Social.length > 0
      ) {
        const social = airstackData.userData.Socials.Social[0];
        userData = {
          name: social.profileDisplayName || social.profileName || "Unknown",
          username: social.profileName || "unknown",
          fid: social.userId || "N/A",
          userCreatedAt:social.userCreatedAtBlockTimestamp || "N/A",
          profileDisplayName: social.profileDisplayName || "N/A",
          profileImageUrl:
            social.profileImageContentValue?.image?.extraSmall ||
            social.profileImage ||
            "",
        };
      } else {
        throw new Error("No user data found");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      error = (err as Error).message;
    } finally {
      isLoading = false;
    }
  };

  const Around = async (fid: string) => {
    try {
      const wpUrl = `${appURL()}/api/around?fid=${encodeURIComponent(fid)}`;
      const aroundResponse = await fetch(wpUrl);
      if (!aroundResponse.ok) {
        throw new Error(`Fid HTTP error! Status: ${aroundResponse.status}`);
      }
      const responseData = await aroundResponse.json();
      // Ensure data is an array and has enough elements
      if (Array.isArray(responseData) && responseData.length >= 3) {
        data = { data: responseData };  // Set 'data' properly
        // console.log("First user:", data?.data[12]?.pfp?.url);
        // console.log("Second user:", responseData[1]);
        // console.log("Third user username:", responseData[2].username);
      } else {
        throw new Error("Invalid response structure or not enough data");
      }
    } catch (err) {
      console.error("Error fetching Time Created:", err);
      error = (err as Error).message;
    }
  };
  
  const extractFid = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      let fid = parsedUrl.searchParams.get("userfid");

      console.log("Extracted FID from URL:", fid);
      return fid;
    } catch (e) {
      console.error("Error parsing URL:", e);
      return null;
    }
  };

  let fid: string | null = null;

  if (ctx.message?.requesterFid) {
    fid = ctx.message.requesterFid.toString();
    console.log("Using requester FID:", fid);
  } else if (ctx.url) {
    fid = extractFid(ctx.url.toString());
    console.log("Extracted FID from URL:", fid);
  } else {
    console.log("No ctx.url available");
  }

  if (!fid && (ctx.state as State)?.lastFid) {
    fid = (ctx.state as State).lastFid ?? null;
    console.log("Using FID from state:", fid);
  }

  console.log("Final FID used:", fid);

  const shouldFetchData =
    fid && (!userData || (userData as UserData).fid !== fid);

  if (shouldFetchData && fid) {
    await Promise.all([fetchUserData(fid), Around(fid)]);
  }
let  default_image_url="https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/7df1c31c-5721-4d33-2d2c-a102a8b3ca00/original" 
  const SplashScreen = () => (
<div tw="flex flex-col w-full h-full bg-[#006994] text-[#f5deb3] font-sans font-bold">
    <div tw="flex">
            <img
              src="https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/c6ef299e-24b6-4bf5-87da-8e556e7a4c00/original"
              alt="Profile"
              tw="w-300 h-300"
            />
    </div>

    </div>
  );
  // bg-[#F0F8FF]
  const ScoreScreen = () => {
    return (
      <div tw="flex flex-col w-full h-full bg-[#3c3446] text-[#FFDEAD] font-sans">
          <div tw="flex flex-row text-white justify-around mt-9">
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[0]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                       />
              <span tw="flex text-xl">{data?.data[0]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[0]?.username ?? "N/A"}</span>
            </div>

            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[1]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                         />
              <span tw="flex text-xl">{data?.data[1]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[1]?.username ?? "N/A"}</span>
            </div>
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[2]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                         />
              <span tw="flex text-xl">{data?.data[2]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[2]?.username ?? "N/A"}</span>
            </div>
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[3]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                         />
              <span tw="flex text-xl">{data?.data[3]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[3]?.username ?? "N/A"}</span>
            </div>
            
                  
            </div>
            <div tw="flex flex-row text-white justify-around mt-6">

            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[4]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                         />
              <span tw="flex text-xl">{data?.data[4]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[4]?.username ?? "N/A"}</span>
            </div>
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[5]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                         />
              <span tw="flex text-xl">{data?.data[5]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[5]?.username ?? "N/A"}</span>
            </div>
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[6]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                       />
              <span tw="flex text-xl">{data?.data[6]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[6]?.username ?? "N/A"}</span>
            </div>
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[7]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                         />
              <span tw="flex text-xl">{data?.data[7]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[7]?.username ?? "N/A"}</span>
            </div>

            
                
            </div>
            <div tw="flex flex-row text-white justify-around mt-6">

            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[8]?.pfp?.url || default_image_url}
                         tw="w-30 h-30 rounded-lg border-4 border-blue-500"
                         />
              <span tw="flex text-xl">{data?.data[8]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[8]?.username ?? "N/A"}</span>
            </div>

            </div>
            <div tw="flex flex-row text-white justify-around mt-6">
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[9]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                         />
              <span tw="flex text-xl">{data?.data[9]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[9]?.username ?? "N/A"}</span>
            </div>
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[10]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                         />
              <span tw="flex text-xl">{data?.data[10]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[10]?.username ?? "N/A"}</span>
            </div>
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[11]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                         />
              <span tw="flex text-xl">{data?.data[11]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[11]?.username ?? "N/A"}</span>
            </div>
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[12]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                         />
              <span tw="flex text-xl">{data?.data[12]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[12]?.username ?? "N/A"}</span>
            </div>
 </div>

 <div tw="flex flex-row text-white justify-around mt-6">
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[13]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                       />
              <span tw="flex text-xl">{data?.data[13]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[13]?.username ?? "N/A"}</span>
            </div>
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[14]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                       />
              <span tw="flex text-xl">{data?.data[14]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[14]?.username ?? "N/A"}</span>
            </div>
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[15]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                       />
              <span tw="flex text-xl">{data?.data[15]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[15]?.username ?? "N/A"}</span>
            </div>
            <div tw="flex flex-col items-center justify-center">
                     <img
                         src={data?.data[16]?.pfp?.url || default_image_url}
                         tw="w-27 h-27 rounded-full border-4 border-[#FFFACD]"
                       />
              <span tw="flex text-xl">{data?.data[16]?.fid ?? "N/A"}</span>
              <span tw="flex text-2xl">{data?.data[16]?.username ?? "N/A"}</span>
            </div>
            

            </div>





            <div tw="flex bg-[#FFFACD] mt-10 text-black w-full justify-end ">
          <div tw="flex text-3xl pr-20">frame by @cashlessman.eth</div>
        
        </div>

      </div>
    );
  };
  const shareText = encodeURIComponent(
    `Check Who Joined Around You \n \nframe by @cashlessman.eth`
);


  const shareUrl1 = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=https://joined-around.vercel.app/frames`;

  const shareUrl2 = `https://warpcast.com/~/compose?text=${shareText}&embeds[]=https://joined-around.vercel.app/frames${
    fid ? `?userfid=${fid}` : ""
  }`;


  const buttons = [];

  if (!userData) {
    buttons.push(
      <Button action="post" target={{ href: `${appURL()}?userfid=${fid}` }}>
        Check Me
      </Button>,
      <Button action="link" target={shareUrl1}>
        Share
      </Button>,
         <Button
         action="link"
         target="https://warpcast.com/cashlessman.eth"
         >
        Builder 👤
       </Button>
      
    );
  } else {
    buttons.push(
      <Button action="post" target={{ href: `${appURL()}?userfid=${fid}` }}>
        Check Me
      </Button>,
      <Button action="link" target={shareUrl1}>
        Share
      </Button>,
            <Button action="post" target={`https://around-dm.vercel.app/frames`}>
            Get DC
          </Button>,
         <Button
         action="link"
         target="https://warpcast.com/cashlessman.eth"
         >
        Builder 👤
       </Button>
      
    );
  }

  return {
    image: fid && !error ? <ScoreScreen /> : <SplashScreen /> ,
    buttons: buttons,
    imageOptions: { aspectRatio: "1:1" },
  };
});

export const GET = frameHandler;
export const POST = frameHandler;
