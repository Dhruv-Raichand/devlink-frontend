const UserCard = ({ user }) => {
  return (
    <div className="my-13 card bg-base-300 w-96 shadow-sm">
      <figure>
        <img src={user?.photoUrl} alt="avatar" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {user?.firstName} {user?.lastName}
        </h2>
        {user?.age && user?.gender && (
          <p>
            {user?.age}, {user?.gender}
          </p>
        )}
        <p>{user?.about}</p>
        <div className="card-actions justify-around">
          <button className="btn btn-primary">Ignore</button>
          <button className="btn btn-secondary">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
