#!/bin/bash
# 1. Replace dart:io
python3 -c "
import os, re
count = 0
for root, dirs, files in os.walk('lib'):
    for file in files:
        if file.endswith('.dart'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            if 'import \'dart:io\';' in content or 'import \"dart:io\";' in content:
                count += 1
                new_content = re.sub(r'import\s+[\'\"]dart:io[\'\"];', 'import \'package:universal_io/io.dart\';', content)
                with open(path, 'w') as f:
                    f.write(new_content)
print(f'Total replaced: {count}')
"

# 2. Modify pubspec.yaml
sed -i 's/dependencies:/dependencies:\n  universal_io: ^2.2.2/' pubspec.yaml
sed -i '/background_fetch:/d' pubspec.yaml
sed -i '/flutter_pdfview:/d' pubspec.yaml
# (the sed for dependencies adds it, let's fix if it adds to dev_dependencies)
python3 -c "
with open('pubspec.yaml', 'r') as f:
    c = f.read()
c = c.replace('dev_dependencies:\n  universal_io: ^2.2.2\n', 'dev_dependencies:\n')
with open('pubspec.yaml', 'w') as f:
    f.write(c)
"

# 3. Handle workmanager
mv lib/core/background/workmanager_init.dart lib/core/background/workmanager_native.dart

cat << 'INNER_EOF' > lib/core/background/workmanager_stub.dart
class BackgroundSyncManager {
  static Future<void> initialize() async {}
  static void registerPeriodicSync() {}
  static void registerOneOffSync() {}
}
INNER_EOF

cat << 'INNER_EOF' > lib/core/background/workmanager_init.dart
export 'workmanager_stub.dart'
    if (dart.library.io) 'workmanager_native.dart';
INNER_EOF

