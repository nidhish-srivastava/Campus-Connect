"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
// import axios from "axios";
import { useConnectContext } from "../context/context";

type AuthId = {
  username: string;
  _id: number;
};

export type UserType = {
  _id : string;
  authId: AuthId;
  followers: string[];
  following: string[];
};

function FetchUsers() {
  const { userId, user, userDocumentId,trigger,setTrigger } = useConnectContext();
  const [fetchUser, setFetchUser] = useState([]);
  const [change, setChange] = useState(false);

  const FetchAll = async () => {
    const response = await fetch(`http://localhost:4000/user`, {
      method: "GET",
    });
    const data = await response.json();
    // const filter = data.filter((e : UserType)=>e._id!=userDocumentId)
    setFetchUser(data);
    setTrigger((e) => !e); //* Just triggered one more reload so that it removes the user
    filterHandler();
  };

  const filterHandler = () => {
    setFetchUser((e: any) => {
      const filter = e.filter((e: UserType) => e._id != userDocumentId);
      return filter;
    });
  };

  // useEffect(()=>{
  //  filterHandler()
  // },[])

  // const FetchLoggedInUser =  async()=>{
  //   const response =  await fetch(`http://localhost:4000/user/${userId}`)
  //   const data = await response.json()
  //   //  setUserDocumentId(data._id)
  //    console.log(data);
  //  }

  // const checkFollow = () =>{
  //   fetchUser.map((e : UserType)=>{
  //     if(e.followers.find(e=>e==userDocumentId)){
  //       console.log(e.followers.find(e=>e==userDocumentId));
  //       setCheck(e.followers.find(e=>e==userDocumentId))
  //     }
  //   })
  // }

  const follow = async (followUserId: string) => {
    const response = await fetch(`http://localhost:4000/user/follow`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userDocumentId, followUserId }),
    });
    const data = await response.json();
    console.log(data);
    setChange((e) => !e);
  };
  const unfollow = async (unfollowUserId: string) => {
    const response = await fetch(`http://localhost:4000/user/unfollow`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userDocumentId, unfollowUserId }),
    });
    const data = await response.json();
    console.log(data);
    setChange((e) => !e);
  };

  useEffect(() => {
    FetchAll()
  }, [change, trigger]);

  return (
    <div>
      <h2 className="text-center">{user}</h2>
      <h2>My user id is {userId}</h2>
      <h2>My user document is {userDocumentId}</h2>
      {fetchUser?.map((e: UserType, i) => (
        <div key={i}>
          <h2 className="text-2xl my-2">{e?.authId?.username}</h2>
          <h2>Followers : {e?.followers.length}</h2>
          <h2>Following : {e?.following.length}</h2>
          {
            <div>
              {!e.followers.find((e) => e == userDocumentId) ? (
                <Button
                  onClick={() => follow(e._id)}
                  className="p-2 text-sm mx-2 bg-green-700"
                >
                  Follow
                </Button>
              ) : (
                <Button
                  onClick={() => unfollow(e._id)}
                  className="p-2 text-sm mx-2 bg-orange-400"
                >
                  UnFollow
                </Button>
              )}
            </div>
          }
        </div>
      ))}
      {/* <button onClick={checkFollow}>Check</button> */}
    </div>
  );
}
export default FetchUsers;
