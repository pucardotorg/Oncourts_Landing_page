import Image from "next/image";
import { useState } from "react";
import {
  litigantsData,
  advocatesData,
  advocateClerksData,
  judgesData,
  courtStaffData,
} from "../../data/about";

const AccordionItem = ({ title, content, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-300">
      <button
        onClick={onToggle}
        className="flex justify-between w-full py-4 text-left focus:outline-none"
        aria-expanded={isOpen}
        aria-controls={`content-${title.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <span className="font-bold">{title}</span>
        <span className="text-2xl">{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && <div className="pb-4">{content}</div>}
    </div>
  );
};

export default function About() {
  const [openIndices, setOpenIndices] = useState({
    litigants: null,
    advocates: null,
    advocateClerks: null,
    judges: null,
    courtStaff: null,
  });

  const handleToggle = (section, index) => {
    setOpenIndices((prevState) => ({
      ...prevState,
      [section]: prevState[section] === index ? null : index,
    }));
  };

  return (
    <div>
      <div className="relative h-80 w-full">
        <Image
          src="/images/base.jpeg"
          alt="Header Image"
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-10">
          <h1 className="text-4xl font-bold bg-white text-black p-4">About Us</h1>
        </div>
      </div>
      <div className="text-center my-8 mx-16">
        <p className="text-lg mb-4">
          The Kerala High Court is launching a new court, called 24x7 ON Courts,
          with a transformed dispute resolution experience for all users. The
          24x7 ON Courts advance the vision outlined in Phase III of the Supreme
          Court eCourts policy.
        </p>
        <p className="text-lg">
          Starting with cheque-dishonor cases under the Negotiable Instruments
          Act that comprise 10% of the criminal pendency, the first of these
          courts, 24x7 ON Court Kollam will go live and accept the first case
          from November 2024.
        </p>
      </div>

      <div className="flex items-center justify-between my-8 px-4">
        <div className="w-1/2 pl-12">
          <Image
            src="/images/vision.png"
            alt="Side Image"
            width={600}
            height={300}
            className="object-cover"
          />
        </div>
        <div className="w-1/2 pr-12">
          <h2 className="text-4xl font-bold text-teal">Vision</h2>
          <p className="mt-4 text-darkGrey">
            24x7 ON Courts are like shifting from paper maps to digital maps.
            Just like a map app guides you to your destination, 24x7 ON Courts
            guide you towards justice. We envision a future in which courts go
            to people, instead of people going to courts. A future where courts
            proactively deliver and enable just-in-time services to people
            shaped around their unique needs, preferences, circumstances, and
            location. The 24x7 ON Courts have been designed to realise this
            vision. Starting with cheque-dishonor cases that comprise 10% of the
            criminal pendency, the 24x7 ON Courts seek to transform the
            resolution experience of people. They unlock the power of simplified
            processes, open information and communication...read more
          </p>
        </div>
      </div>

      <h2 className="text-4xl font-bold text-teal text-center mb-2">
        Design Principles
      </h2>
      <h4 className="text-xl text-center mb-8">
        ON Courts are guided by the following design principles:
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 text-darkGrey mx-8">
        <div className="group border rounded-lg p-4 text-center transition-colors duration-300 hover:bg-teal bg-white border-teal cursor-pointer">
          <h3 className="font-bold text-lg uppercase text-teal transition-colors duration-300 group-hover:text-white mb-2">
            People Centric
          </h3>
          <p className="mt-2 text-black transition-colors duration-300 group-hover:text-white">
            24x7 ON Courts transform processes to make court administration
            people centric. They prioritise understanding user needs to improve
            accessibility, fairness, equity, and empathy in the resolution
            process.
          </p>
        </div>


        <div className="group border rounded-lg p-4 text-center transition-colors duration-300 hover:bg-teal bg-white border-teal cursor-pointer">
          <h3 className="font-bold text-lg uppercase text-teal transition-colors duration-300 group-hover:text-white mb-2">Open</h3>
          <p className="mt-2 text-black transition-colors duration-300 group-hover:text-white">
            24x7 ON Courts make information open and actionable to the users,
            adopt open technology, access and data on functioning of courts.
            They are open subject to data governance frameworks to ensure
            privacy, security, and judicial integrity.
          </p>
        </div>

        <div className="group border rounded-lg p-4 text-center transition-colors duration-300 hover:bg-teal bg-white border-teal cursor-pointer">
          <h3 className="font-bold text-lg uppercase text-teal transition-colors duration-300 group-hover:text-white mb-2">Design for Management</h3>
          <p className="mt-2 text-black transition-colors duration-300 group-hover:text-white">
            24x7 ON Courts are designed through an iterative process through
            consultations from various users of the court. They also enable
            integrations with allied departments and institutions to ensure
            seamless movement of information and updates. They will also open up
            APIs and enable the ecosystem to create needed services.
          </p>
        </div>
      </div>


      <div className="my-8">
        <h2 className="text-4xl font-bold text-teal text-center mb-4">
          New Experience
        </h2>
        <p className="text-center text-darkGrey mb-4">
          You will find the process
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mx-8">
          <div className="p-4">
            <h3 className="font-bold text-lg uppercase text-teal mb-2 text-center">
              Accessible and Predictable
            </h3>
            <p className="text-darkGrey">
              Communicate with the court and take actions that progress your
              case asynchronously. File a case, respond to summons, submit
              applications and coordinate hearing schedules from anywhere at
              your convenience. Have greater predictability and visibility into
              your hearings.
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg uppercase text-teal mb-2 text-center">
              Assisted and Empowering
            </h3>
            <p className="text-darkGrey">
              Get real time updates on your case: amounts paid, next date of
              hearing, status of summons, and orders passed. Receive alerts for
              action to be taken including applications to be submitted or
              payments to be made. Use templates, prompts, dashboards to take
              action easily. Approach the courtroom manager for any assistance.
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg uppercase text-teal mb-2 text-center">
              Seamless & Frictionless
            </h3>
            <p className="text-darkGrey">
              Interact with surrounding institutions such as banks, police, and
              post with ease. Track the real time status of summons. Proactively
              receive verifiable copies of all your documents: summons, orders
              and judgements.
            </p>
          </div>
        </div>
      </div>

      <div className="my-8 mx-16">
        <h2 className="text-4xl font-bold text-teal mb-2 text-center">
          Benefits
        </h2>
        <p className="text-sm mb-8 text-center">
          The ON Courts are designed to realize the vision of taking courts to
          people and offer multiple benefits.
        </p>

        <div className="flex items-start mb-12 justify-between">
          <div className="w-1/2 pr-8">
            <h3 className="text-2xl font-bold mb-4">Litigants</h3>
            <div className="mb-8">
              {litigantsData.map((item, index) => (
                <AccordionItem
                  key={index}
                  title={item.title}
                  content={item.content}
                  isOpen={openIndices.litigants === index}
                  onToggle={() => handleToggle("litigants", index)}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center w-1/2">
            <Image
              src="/images/litigants.png"
              alt="Benefits Image"
              width={200}
              height={100}
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex items-center mb-12 justify-between">
          <div className="flex justify-center items-center w-1/2">
            <Image
              src="/images/lawyer.png"
              alt="Benefits Image"
              width={200}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="w-1/2 pr-8">
            <h3 className="text-2xl font-bold mb-4">Advocates</h3>
            <div className="mb-8">
              {advocatesData.map((item, index) => (
                <AccordionItem
                  key={index}
                  title={item.title}
                  content={item.content}
                  isOpen={openIndices.advocates === index}
                  onToggle={() => handleToggle("advocates", index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-12">
          <div className="w-1/2 pr-8">
            <h3 className="text-2xl font-bold mb-4">Advocate Clerks</h3>
            <div className="mb-8">
              {advocateClerksData.map((item, index) => (
                <AccordionItem
                  key={index}
                  title={item.title}
                  content={item.content}
                  isOpen={openIndices.advocateClerks === index}
                  onToggle={() => handleToggle("advocateClerks", index)}
                />
              ))}
            </div>
          </div>

          <div className="w-1/2 flex justify-center items-center">
            <Image
              src="/images/adv_clerk.png"
              alt="Benefits Image"
              width={200}
              height={100}
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-12">
          <div className="w-1/2 flex justify-center items-center">
            <Image
              src="/images/judge.png"
              alt="Benefits Image"
              width={200}
              height={100}
              className="object-cover"
            />
          </div>

          <div className="w-1/2 pr-8">
            <h3 className="text-2xl font-bold mb-4">Judge</h3>
            <div className="mb-8">
              {judgesData.map((item, index) => (
                <AccordionItem
                  key={index}
                  title={item.title}
                  content={item.content}
                  isOpen={openIndices.judges === index}
                  onToggle={() => handleToggle("judges", index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-12">

          <div className="w-1/2 pr-8">
            <h3 className="text-2xl font-bold mb-4">Court Staff</h3>
            <div className="mb-8">
              {courtStaffData.map((item, index) => (
                <AccordionItem
                  key={index}
                  title={item.title}
                  content={item.content}
                  isOpen={openIndices.advocateClerks === index}
                  onToggle={() => handleToggle("courtStaff", index)}
                />
              ))}
            </div>
          </div>

          <div className="w-1/2 flex justify-center items-center">
            <Image
              src="/images/court staff.png"
              alt="Benefits Image"
              width={200}
              height={100}
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex items-start mb-12">
          <div className="w-1/2 pr-8">
            <h3 className="text-2xl font-bold mb-4">Governance</h3>
            <div className="mb-8">
              <div>
                <p>Chief Justice, Kerala High Court</p>
                <hr className="border-t border-darkGrey my-2" />
                <p>Computer Committee, Kerala High Court</p>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <h2 className="text-teal font-bold text-2xl text-center">
              Roadmap
            </h2>
            <p className="flex-1">
              The High Court of Kerala is committed to improve ON Courts through
              a continuous process of feedback, monitoring and evaluation. To
              increase access to court services, the High Court of Kerala seeks
              to scale ON Courts in a phased manner over the next three years.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
