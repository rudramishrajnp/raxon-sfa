import re

with open('pubspec.yaml', 'r') as f:
    content = f.read()

deps = """  firebase_core: ^3.1.0
  firebase_messaging: ^15.0.1
  flutter_local_notifications: ^17.1.2
  socket_io_client: ^3.0.0
  uuid: ^4.4.0
  file_picker: ^8.0.3
  image_picker: ^1.1.1
"""

content = re.sub(r'dependencies:\n  flutter:\n    sdk: flutter\n', r'dependencies:\n  flutter:\n    sdk: flutter\n' + deps, content)

with open('pubspec.yaml', 'w') as f:
    f.write(content)
