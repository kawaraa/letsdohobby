import React from "react";

export default (props) => {
  const name = props.name || "";

  return (
    <svg viewBox="0 0 350 400" className={name + " arrow svg"}>
      <path
        d="m12.1422,33.24019c0.2154,-86.957 325.77724,122.23328 325.72106,167.66834c-0.0562,45.43506 -326.09022,253.06995 -325.24343,166.71764c-0.1592,-111.462 -0.69302,-247.42898 -0.47761,-334.38598l-0.00001,0z"
        className={name + " arrow svg-stroke"}
      />
    </svg>
  );
};
