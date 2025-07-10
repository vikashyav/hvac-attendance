function IconSuccess(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 60 60" {...props}>
      <g transform="translate(-10 -10)">
        <path d="M10 10h60v60H10z" fill="none" />
        <circle cx={30} cy={30} r={30} transform="translate(10 10)" fill="#52b920" />
        <path d="M30 40l6.667 6.667L50 33.333" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3px" fill="none" />
      </g>
    </svg>
  );
}

export default IconSuccess;
