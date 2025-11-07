import Notes from '../components/Notes';

const Home = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="min-vh-100" style={{ background: 'var(--bg-primary)' }}>
      <Notes searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
};

export default Home;