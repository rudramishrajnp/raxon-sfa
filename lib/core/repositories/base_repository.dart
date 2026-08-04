abstract class BaseRepository<T> {
  /// Fetch data from remote API
  Future<List<T>> fetchRemote();

  /// Fetch data from local SQLite database
  Future<List<T>> fetchLocal();

  /// Save data to local SQLite database
  Future<void> saveLocal(List<T> items);

  /// Synchronize remote and local data
  Future<void> sync();

  /// Queue an item for offline background sync
  Future<void> queueForSync(T item, String operation);
}
