import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GoogleAuthProvider,signInWithPopup,signOut } from "firebase/auth";
import { persist,createJSONStorage } from "zustand/middleware";
import { auth,provider } from "../utils/firebase";
import dummyImage from '../assets/Dummy Profile.png'
import { ExtendedUser,InitialUser } from "../interfaces/user";
interface UserState{
  socketId:string|null;
  //token:string|null;
  user:ExtendedUser|InitialUser;
  setSocketId: (socketId: string | null) => void;
  signInUser:()=>void;
  signOutUser:()=>void;
  setName: (name: string) => void;

}
const initialUser: InitialUser = {
  displayName: 'Guest',
  photoURL: dummyImage,
  stats: {
    averageWpm: 0,
    races: 0,
  },
};

const useUserStore = create<UserState>()(
  devtools(
    // persist(

    persist(
      (set, get) => ({
        user: initialUser,
        socketId: null,

     
        setUser: (user) => {
          set({ user });
        },

        setSocketId: (socketId) => {
          set({ socketId });
        },

      
        setName: (name) => {
          set((state) => ({ user: { ...state.user, displayName: name! } }));
        },

    
        signInUser: async () => {
          await signInWithPopup(auth, provider)
            .then((result) => {
              const credential =
                GoogleAuthProvider.credentialFromResult(result);
              const user = result.user as ExtendedUser;

    
              set({ user });
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              const email = error.customData.email;
              const credential = GoogleAuthProvider.credentialFromError(error);
              console.error(errorCode, errorMessage, email, credential);
            });
        },

        signOutUser: async () => {
          await signOut(auth);
          set({ user: initialUser });
        },
      }),
      {
        name: 'user-storage',
        getStorage: () => localStorage,
        partialize: (state) => ({ user: state.user }),
      }
    )
  )
);

export default useUserStore;