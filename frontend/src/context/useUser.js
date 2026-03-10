import { useContext } from 'react';
import { UserContext } from './userContextObject';

export const useUser = () => useContext(UserContext);
