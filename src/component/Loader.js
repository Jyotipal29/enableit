import React from "react";

function Loader({ label }) {
  return (
    <div className="flex-center gap-xs">
      <div className="loader" />
      {label}
    </div>
  );
}

export default Loader;
