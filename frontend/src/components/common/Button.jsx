export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-pet-blue text-white hover:bg-opacity-90",
    secondary: "bg-pet-orange text-white hover:bg-opacity-90",
    outline: "border-2 border-pet-blue text-pet-blue hover:bg-pet-blue hover:text-white",
  };
  
  return (
    <button 
      className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};