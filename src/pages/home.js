import React from "react";
import Notes from "../components/Notes";

export default function Home({ showAlert }) {
  return (
    <>
      <div>
        <Notes showAlert={showAlert} />
      </div>
    </>
  );
}
