import React from "react";

export interface IUser {
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    bio: string;
    phone: string;
    address: {
      street1: string;
      city: string;
      country: string;
    };
  };
}

interface UserProps {
  user: IUser;
}

const UserCard: React.FC<UserProps> = ({ user }) => {
  return (
    <div>
      <h2>
        {user.profile.firstName} {user.profile.lastName}
      </h2>
      <p>Email: {user.email}</p>
      <p>Username: {user.username}</p>
      <p>Bio: {user.profile.bio}</p>
      <p>Phone: {user.profile.phone}</p>
      <p>
        Address: {user.profile.address.street1}, {user.profile.address.city},{" "}
        {user.profile.address.country}
      </p>
    </div>
  );
};

export default UserCard;
