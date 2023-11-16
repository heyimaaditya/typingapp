import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GoogleAuthProvider,signInWithPopup,signOut } from "firebase/auth";
import { persist,createJSONStorage } from "zustand/middleware";
import { auth,provider } from "../utils/firebase";
import dummyImage from '../assets/Dummy Profile.png'
import { ExtendedUser,InitialUser } from "../interfaces/user";
interface UserState{
  socketId:string|null;
  token:string|null;
  user:ExtendedUser|InitialUser;
  setSocketId: (socketId: string | null) => void;
  signInUser:()=>void;
  signOutUser:()=>void;

}
const initialUser: InitialUser = {
  displayName: 'Guest',
  photoURL: dummyImage,
  stats: {
    averageWpm: 0,
    races: 0,
  },
};

const useUserStore=create<UserState>()(
  /*wraps the store with devtools for debugging purpose*/
  devtools((set,get)=>({
    user:initialUser,
    token:null,
    socketId:null,
    setSocketId:(socketId)=>{
      set({socketId});
    }
  },
    /*wraps the store with persistence midlleware to save changes*/
    
        //sign-in process using firebase
  signInUser:async()=>{
          /*initiates the firebase authentication process with google authentication retreiving user data and acces token */
    await signInWithPopup(auth,provider).then((result)=>{
      const credential=GoogleAuthProvider.credentialFromResult(result);
      const token=credential!.accessToken;
      const user=result.user;
      set({user,token});

    }).catch((error)=>{
    const errorCode=error.code;
    const errorMessage=error.message;
    const email=error.customData.email;
    const credential=GoogleAuthProvider.credentialFromError(error);
    console.error(errorCode,errorMessage,email,credential)

    })
  },
        /*sign-out process using firebase*/
  signOutUser:async()=>{
    await signOut(auth);
    set({user:null,token:null});
    useUserStore.persist.clearStorage();

    }
  }))
)
export default useUserStore;