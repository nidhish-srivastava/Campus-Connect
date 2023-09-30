"use client"
import React, { Fragment, useEffect, useState } from "react";
import { UserType } from "@/types";
import { useParams } from "next/navigation";
import { Montserrat } from "next/font/google";
const fontMontserrat = Montserrat({ subsets: ["latin"] });
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  const { userProfile } = useParams();
  const [data,setData] = useState<UserType[]>([])
  useEffect(()=>{
    const getFollowing = async ()=> {
      const response = await fetch(`http://localhost:4000/user/following/${userProfile}`);
      const data = await  response.json();
      console.log(data);
      setData(data.following)
    };
    getFollowing()
  },[])
  return (
    <div
      className={`grid grid-cols-2 w-[20%] mx-auto items-center mt-20 gap-10 ${fontMontserrat.className} `}
    >
      {data?.map((e,i)=>{
        return(
          <Link href={`/${e.authId.username}`} key={i}>
            <div className="flex gap-8 items-center">
             <label className="text-xl">{e?.authId?.username}</label>
            <Image
            src = {e.authId?.dp}
            width={60}
            height={60}
            alt='dp'
            />
              {/* <Button
                className="follow-unfollow-btn"
                >
                UnFollow
                </Button>
                <Button
                className="follow-unfollow-btn"
                >
                Follow
              </Button> */}
              </div>
          </Link>
        )
      })}
    </div>
  );
};

export default page;