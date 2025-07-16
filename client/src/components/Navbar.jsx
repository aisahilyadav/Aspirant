import React from 'react';
import Layout from './Layout';

const Navbar = ({ children }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default Navbar;