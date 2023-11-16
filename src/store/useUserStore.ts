import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GoogleAuthProvider,signInWithPopup,signOut,User } from "firebase/auth";
import { persist,createJSONStorage } from "zustand/middleware";
import { auth,provider } from "../utils/firebase";
interface UserState{
  token:string|null;
  user:User|null;
  signInUser:()=>void;
  signOutUser:()=>void;

}
const useUserStore=create<UserState>()(
  /*wraps the store with devtools for debugging purpose*/
  devtools(
    /*wraps the store with persistence midlleware to save changes*/
    persist(
      (set,get)=>({
        //state properties and functions
        user:null,
        token:null,
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
      }),
      {
        name:'food-storage',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({ user: state.user, token: state.token }),
      }
    )
  )
)
export default useUserStore;