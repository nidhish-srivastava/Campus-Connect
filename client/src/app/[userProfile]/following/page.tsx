"use client"
import React, { useEffect, useState } from "react";
import { UserType } from "@/types";
import { useParams } from "next/navigation";
import { Montserrat } from "next/font/google";
const fontMontserrat = Montserrat({ subsets: ["latin"] });
import Image from "next/image";
import Link from "next/link";
import { baseUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const { userProfile } = useParams();
  const [data,setData] = useState<UserType[]>([])
  const [loading,setLoading] = useState(false)
  useEffect(()=>{
    const getFollowing = async ()=> {
      setLoading(true)
      try {
        const response = await fetch(`${baseUrl}/user/following/${userProfile}`);
        const data = await  response.json();
        // console.log(data);
        setData(data.following)
      } catch (error) {
        
      }
      finally{
        setLoading(false)
      }
    };
    getFollowing()
  },[])
  return (
    <>
    {
      !loading ? 
      <div
        className={`flex flex-col items-center justify-center gap-10 w-[20%] mx-auto mt-20 ${fontMontserrat.className} `}
      >
        {data?.map((e,i)=>{
          return(
            <Link href={`/${e.authId.username}`} key={i}>
              <div className=" grid grid-cols-2 gap-6 items-center">
              <Image
              src = {e?.authId?.dp}
              width={60}
              height={60}
              alt='dp'
              />
               <label className="text-xl">{e?.authId?.username}</label>
                </div>
            </Link>
          )
        })}
      </div>
      : 
      <div className="flex min-h-full gap-5 items-center justify-center">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-8 w-[400px]" />
      <Skeleton className="h-8 w-[400px]" />
    </div>
  </div>
    }
    </>
  );
};

export default Page;
