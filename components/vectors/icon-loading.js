function IconLoading(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="60px" height="60px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" {...props}>
      <circle cx={50} cy={50} fill="none" stroke="currentcolor" strokeWidth={6} r={43} strokeDasharray="202.63272615654165 69.54424205218055">
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="0.6666666666666666s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        />
      </circle>
    </svg>
  );
}

export default IconLoading;
