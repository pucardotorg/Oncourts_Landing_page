import React from "react";
import Vision from "../../components/AboutUs/Vision";
import GuidingPrinciples from "../../components/AboutUs/GuidingPrinciples";
import Technology from "../../components/AboutUs/Technology";
import ONCourtsExperience from "../../components/AboutUs/ONCourtsExperience";
import Benefits from "../../components/AboutUs/Benefits";
import Jurisdiction from "../../components/AboutUs/Jurisdiction";
import UserVoices from "../../components/AboutUs/UserVoices";
import Head from "next/head";
import { useMediaQuery } from "@mui/system";

export default function About() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <>
      <Head>
        <title>About ON Courts | Digital Case Management</title>
        <meta
          name="description"
          content="Learn about ON Courts, our vision, principles, and how we're transforming the judicial experience"
        />
      </Head>

      {/* Main content in requested sequence */}
      <Vision />
      <GuidingPrinciples />
      <Technology />
      <ONCourtsExperience />
      <Benefits />
      <Jurisdiction isMobile={isMobile} />
      <UserVoices />
    </>
  );
}
