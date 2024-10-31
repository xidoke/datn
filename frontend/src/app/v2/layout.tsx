import AuthProvider from "../authProvider";

const LayoutV2 = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};
export default LayoutV2;
