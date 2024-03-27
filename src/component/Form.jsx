import React from "react";
import { IoIosSearch } from "react-icons/io";

// const Input = React.forwardRef((props, ref) => {
//   return <input ref={ref} type="text" placeholder="enter country name" />;
// });

function Form({ onSubmit, onRef }) {
  return (
    <form onSubmit={onSubmit}>
      {/* <Input ref={onRef} /> */}
      <input ref={onRef} type="text" placeholder="enter country name" />
      <button>
        <IoIosSearch />
      </button>
    </form>
  );
}

export default Form;
