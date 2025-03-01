function MapComponent() {
    const [users, setUsers] = useState({});
    const [lastUpdate, setLastUpdate] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const usersRef = ref(database, 'users');
      
      const unsubscribe = onValue(usersRef, (snapshot) => {
        setUsers(snapshot.val() || {});
        setLastUpdate(new Date().toLocaleTimeString());
        setLoading(false);
      }, (error) => {
        console.error('Database connection error:', error);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    return (
      <div className="map-container">
        {loading && (
          <div className="loading-overlay">
            <CircularProgress />
            <Typography variant="body1">Loading live locations...</Typography>
          </div>
        )}
        
        <div className="status-bar">
          <Typography variant="subtitle2">
            Last update: {lastUpdate || 'Never'}
          </Typography>
        </div>
  
        <MapContainer center={[51.505, -0.09]} zoom={13}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {Object.entries(users).map(([userId, data]) => (
            <Marker
              key={userId}
              position={[data.location.latitude, data.location.longitude]}
              icon={new Icon({
                iconUrl: '/marker-icon.png',
                iconSize: [25, 41],
              })}
            >
              <Popup>
                <div className="user-popup">
                  <Typography variant="subtitle2">User ID: {userId}</Typography>
                  <Typography variant="caption">
                    Last update: {new Date(data.location.timestamp).toLocaleTimeString()}
                  </Typography>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
  
        <style jsx global>{`
          .map-container {
            position: relative;
            height: 100vh;
            width: 100%;
          }
          
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .status-bar {
            position: absolute;
            top: 10px;
            right: 10px;
            background: white;
            padding: 8px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 500;
          }
          
          .user-popup {
            min-width: 180px;
          }
        `}</style>
      </div>
    );
  }