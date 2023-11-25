import LoadingComponent from "react-loading";
const Loading = ({ type, color, height, width, className }) => {
  return (
    <LoadingComponent
      type={type}
      color={color}
      height={height}
      width={width}
      className={className}
    />
  );
};

export default Loading;
