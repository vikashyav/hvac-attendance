function IconError(props) {
  return (
    <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx={24} cy={24} r={24} fill="#F65B5B" />
      <path d="M18 19L30.5 31.5" stroke="white" strokeWidth={2.3} strokeLinecap="round" />
      <path d="M18 31.5L30.5 19" stroke="white" strokeWidth={2.3} strokeLinecap="round" />
    </svg>
  );
}

export default IconError;
