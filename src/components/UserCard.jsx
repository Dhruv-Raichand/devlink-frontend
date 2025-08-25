const UserCard = (props) => {
  const { user } = props;

  return (
    <div className=" mx-auto my-18 card bg-base-200 w-96 shadow-sm">
      <figure>
        <img src={user?.photoUrl} alt="avatar" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{user?.firstName}</h2>
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
