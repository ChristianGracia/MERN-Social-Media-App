import React from "react";

export default function Footer() {
  return (
    <div>
      <footer
        className="mt-5 p-3 text-center"
        style={{ color: "white", backgroundColor: "#17A2B8" }}
      >
        Copyright &copy; {new Date().getFullYear()} CodeBook
      </footer>
    </div>
  );
}
