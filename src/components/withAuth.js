import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated, getRole } from '../utils/sessionManager';

const withAuth = (WrappedComponent, allowedRoles = []) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated()) {
        router.replace('/auth/login');
        return;
      }

      if (allowedRoles.length > 0) {
        const userRole = getRole();
        if (!allowedRoles.includes(userRole)) {
          router.replace('/unauthorized');
        }
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
