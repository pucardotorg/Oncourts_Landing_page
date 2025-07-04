import React, { useState, useEffect } from "react";
import Head from "next/head";
import PersonCard from "../../components/common/PersonCard";
import SectionHeading from "../../components/common/SectionHeading";

// Data structure to hold all the people information
const peopleData = {
  chiefJustices: [
    {
      name: "Justice Nitin Jamdar",
      title: "Chief Justice",
      image: "/images/jOne.png",
    },
  ],
  oncourt: {
    magistrates: [
      {
        name: "Sri. Micheal George",
        title: "Judicial First Class Magistrate",
        image: "/images/jThree.png",
      },
    ],
    employees: [
      {
        name: "Sri. Raju A",
        title: "Office Superintendent",
        image: "",
      },
      {
        name: "Smt. Shibha K.",
        title: "Head Clerk",
        image: "",
      },
      {
        name: "Smt. Sony P.",
        title: "Computer Assistant",
        image: "",
      },
      {
        name: "Rakhi",
        title: "Office Clerk (2019-2021)",
        image: "",
      },
    ],
  },
  formerMagistrates: [
    {
      name: "Smt. Soumya S Subramanian",
      title: "Judicial First Class Magistrate",
      image: "",
    },
  ],
};

const People = () => {
  // State to track the maximum height of all text sections
  const [maxTextHeight, setMaxTextHeight] = useState<number>(0);

  // Function to update the maximum height
  const updateMaxHeight = (height: number) => {
    setMaxTextHeight((prev) => Math.max(prev, height));
  };

  // Reset the max height when the component unmounts
  useEffect(() => {
    return () => setMaxTextHeight(0);
  }, []);
  return (
    <>
      <Head>
        <title>ON Courts People | Judicial Staff</title>
        <meta
          name="description"
          content="Meet the dedicated team of judicial officers and staff at ON Courts"
        />
      </Head>

      <div className="py-8 md:py-12 bg-[#F0FDFA]">
        <div className="w-[80%] md:w-[90%] lg:w-[90%] mx-auto px-2 sm:px-4">
          <SectionHeading
            title="People"
            fontSize="text-5xl"
            className="mb-12"
            showBorder={false}
          />

          {/* High Court of Kerala Section */}
          <div className="mb-16">
            <SectionHeading
              title="High Court of Kerala"
              fontSize="text-4xl"
              className="mb-8"
            />
            <div className="flex justify-center">
              <div
                className={`grid ${
                  peopleData.chiefJustices.length === 1
                    ? "grid-cols-1"
                    : peopleData.chiefJustices.length === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : peopleData.chiefJustices.length === 3
                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                } 
                         gap-4 sm:gap-6 md:gap-8 justify-items-center mx-auto w-full`}
              >
                {peopleData.chiefJustices.map((justice, index) => (
                  <PersonCard
                    key={index}
                    imagePath={justice.image}
                    name={justice.name}
                    title={justice.title}
                    cardHeight={maxTextHeight}
                    setMaxHeight={updateMaxHeight}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 24x7 ON Court, Kollam Section */}
          <div className="mb-16">
            <SectionHeading
              title="24x7 ON Court, Kollam"
              fontSize="text-4xl"
              className="mb-8"
            />

            {/* Magistrates */}
            <div className="mb-12">
              <div className="flex justify-center">
                <div
                  className={`grid ${
                    peopleData.oncourt.magistrates.length === 1
                      ? "grid-cols-1"
                      : peopleData.oncourt.magistrates.length === 2
                        ? "grid-cols-1 sm:grid-cols-2"
                        : peopleData.oncourt.magistrates.length === 3
                          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  } 
                         gap-4 sm:gap-6 md:gap-8 justify-items-center mx-auto w-full`}
                >
                  {peopleData.oncourt.magistrates.map((magistrate, index) => (
                    <PersonCard
                      key={index}
                      imagePath={magistrate.image}
                      name={magistrate.name}
                      title={magistrate.title}
                      cardHeight={maxTextHeight}
                      setMaxHeight={updateMaxHeight}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Other Employees */}
            <div className="flex justify-center">
              <div
                className={`grid ${
                  peopleData.oncourt.employees.length === 1
                    ? "grid-cols-1"
                    : peopleData.oncourt.employees.length === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : peopleData.oncourt.employees.length === 3
                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                } 
                         gap-4 sm:gap-6 md:gap-8 justify-items-center mx-auto w-full`}
              >
                {peopleData.oncourt.employees.map((person, index) => (
                  <PersonCard
                    key={index}
                    imagePath={person.image}
                    name={person.name}
                    title={person.title}
                    cardHeight={maxTextHeight}
                    setMaxHeight={updateMaxHeight}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Former Magistrates Section */}
          <div>
            <SectionHeading
              title="Former Magistrates"
              fontSize="text-4xl"
              className="mb-8"
            />
            <div className="flex justify-center">
              <div
                className={`grid ${
                  peopleData.formerMagistrates.length === 1
                    ? "grid-cols-1"
                    : peopleData.formerMagistrates.length === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : peopleData.formerMagistrates.length === 3
                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                } 
                         gap-4 sm:gap-6 md:gap-8 justify-items-center mx-auto w-full`}
              >
                {peopleData.formerMagistrates.map((person, index) => (
                  <PersonCard
                    key={index}
                    imagePath={person.image}
                    name={person.name}
                    title={person.title}
                    cardHeight={maxTextHeight}
                    setMaxHeight={updateMaxHeight}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default People;
