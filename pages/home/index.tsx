import  React, {useEffect} from "react";
import { useRouter } from "next/router";
// import Hero from "../landing/index"
// import Head from "next/head";

export default function Home(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.push({
      pathname: "/",
    });
  })


  // return (
  //   <main>
  //     <Head>
  //       <title>Oncourts - Home</title>
  //       <meta name="description" content="Welcome to Oncourts" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1" />
  //     </Head>
  //     <Hero />
  //   </main>
  // );
}
