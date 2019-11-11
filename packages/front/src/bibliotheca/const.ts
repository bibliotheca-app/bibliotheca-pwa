interface FirebaseConfig {
  apikey: string;
  authdomain: string;
  databaseurl: string;
  projectid: string;
  storagebucket: string;
  messagingsenderid: string;
  appid?: string;
}

export const firebaseConfig: () => FirebaseConfig = () =>
  JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG as any);

export const allowedDomain: string | undefined = process.env.REACT_APP_ALLOWED_DOMAIN;
