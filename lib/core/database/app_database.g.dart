// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_database.dart';

// ignore_for_file: type=lint
class $SyncQueueTableTable extends SyncQueueTable
    with TableInfo<$SyncQueueTableTable, SyncQueueEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $SyncQueueTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _entityTypeMeta =
      const VerificationMeta('entityType');
  @override
  late final GeneratedColumn<String> entityType = GeneratedColumn<String>(
      'entity_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _entityIdMeta =
      const VerificationMeta('entityId');
  @override
  late final GeneratedColumn<String> entityId = GeneratedColumn<String>(
      'entity_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _operationMeta =
      const VerificationMeta('operation');
  @override
  late final GeneratedColumn<String> operation = GeneratedColumn<String>(
      'operation', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _payloadMeta =
      const VerificationMeta('payload');
  @override
  late final GeneratedColumn<String> payload = GeneratedColumn<String>(
      'payload', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<int> status = GeneratedColumn<int>(
      'status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _retryCountMeta =
      const VerificationMeta('retryCount');
  @override
  late final GeneratedColumn<int> retryCount = GeneratedColumn<int>(
      'retry_count', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _errorMessageMeta =
      const VerificationMeta('errorMessage');
  @override
  late final GeneratedColumn<String> errorMessage = GeneratedColumn<String>(
      'error_message', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        entityType,
        entityId,
        operation,
        payload,
        status,
        retryCount,
        errorMessage,
        createdAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'sync_queue_table';
  @override
  VerificationContext validateIntegrity(Insertable<SyncQueueEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('entity_type')) {
      context.handle(
          _entityTypeMeta,
          entityType.isAcceptableOrUnknown(
              data['entity_type']!, _entityTypeMeta));
    } else if (isInserting) {
      context.missing(_entityTypeMeta);
    }
    if (data.containsKey('entity_id')) {
      context.handle(_entityIdMeta,
          entityId.isAcceptableOrUnknown(data['entity_id']!, _entityIdMeta));
    } else if (isInserting) {
      context.missing(_entityIdMeta);
    }
    if (data.containsKey('operation')) {
      context.handle(_operationMeta,
          operation.isAcceptableOrUnknown(data['operation']!, _operationMeta));
    } else if (isInserting) {
      context.missing(_operationMeta);
    }
    if (data.containsKey('payload')) {
      context.handle(_payloadMeta,
          payload.isAcceptableOrUnknown(data['payload']!, _payloadMeta));
    } else if (isInserting) {
      context.missing(_payloadMeta);
    }
    if (data.containsKey('status')) {
      context.handle(_statusMeta,
          status.isAcceptableOrUnknown(data['status']!, _statusMeta));
    }
    if (data.containsKey('retry_count')) {
      context.handle(
          _retryCountMeta,
          retryCount.isAcceptableOrUnknown(
              data['retry_count']!, _retryCountMeta));
    }
    if (data.containsKey('error_message')) {
      context.handle(
          _errorMessageMeta,
          errorMessage.isAcceptableOrUnknown(
              data['error_message']!, _errorMessageMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  SyncQueueEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return SyncQueueEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      entityType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}entity_type'])!,
      entityId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}entity_id'])!,
      operation: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}operation'])!,
      payload: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}payload'])!,
      status: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}status'])!,
      retryCount: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}retry_count'])!,
      errorMessage: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}error_message']),
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  $SyncQueueTableTable createAlias(String alias) {
    return $SyncQueueTableTable(attachedDatabase, alias);
  }
}

class SyncQueueEntry extends DataClass implements Insertable<SyncQueueEntry> {
  final int id;
  final String entityType;
  final String entityId;
  final String operation;
  final String payload;
  final int status;
  final int retryCount;
  final String? errorMessage;
  final DateTime createdAt;
  const SyncQueueEntry(
      {required this.id,
      required this.entityType,
      required this.entityId,
      required this.operation,
      required this.payload,
      required this.status,
      required this.retryCount,
      this.errorMessage,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['entity_type'] = Variable<String>(entityType);
    map['entity_id'] = Variable<String>(entityId);
    map['operation'] = Variable<String>(operation);
    map['payload'] = Variable<String>(payload);
    map['status'] = Variable<int>(status);
    map['retry_count'] = Variable<int>(retryCount);
    if (!nullToAbsent || errorMessage != null) {
      map['error_message'] = Variable<String>(errorMessage);
    }
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  SyncQueueTableCompanion toCompanion(bool nullToAbsent) {
    return SyncQueueTableCompanion(
      id: Value(id),
      entityType: Value(entityType),
      entityId: Value(entityId),
      operation: Value(operation),
      payload: Value(payload),
      status: Value(status),
      retryCount: Value(retryCount),
      errorMessage: errorMessage == null && nullToAbsent
          ? const Value.absent()
          : Value(errorMessage),
      createdAt: Value(createdAt),
    );
  }

  factory SyncQueueEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return SyncQueueEntry(
      id: serializer.fromJson<int>(json['id']),
      entityType: serializer.fromJson<String>(json['entityType']),
      entityId: serializer.fromJson<String>(json['entityId']),
      operation: serializer.fromJson<String>(json['operation']),
      payload: serializer.fromJson<String>(json['payload']),
      status: serializer.fromJson<int>(json['status']),
      retryCount: serializer.fromJson<int>(json['retryCount']),
      errorMessage: serializer.fromJson<String?>(json['errorMessage']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'entityType': serializer.toJson<String>(entityType),
      'entityId': serializer.toJson<String>(entityId),
      'operation': serializer.toJson<String>(operation),
      'payload': serializer.toJson<String>(payload),
      'status': serializer.toJson<int>(status),
      'retryCount': serializer.toJson<int>(retryCount),
      'errorMessage': serializer.toJson<String?>(errorMessage),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  SyncQueueEntry copyWith(
          {int? id,
          String? entityType,
          String? entityId,
          String? operation,
          String? payload,
          int? status,
          int? retryCount,
          Value<String?> errorMessage = const Value.absent(),
          DateTime? createdAt}) =>
      SyncQueueEntry(
        id: id ?? this.id,
        entityType: entityType ?? this.entityType,
        entityId: entityId ?? this.entityId,
        operation: operation ?? this.operation,
        payload: payload ?? this.payload,
        status: status ?? this.status,
        retryCount: retryCount ?? this.retryCount,
        errorMessage:
            errorMessage.present ? errorMessage.value : this.errorMessage,
        createdAt: createdAt ?? this.createdAt,
      );
  SyncQueueEntry copyWithCompanion(SyncQueueTableCompanion data) {
    return SyncQueueEntry(
      id: data.id.present ? data.id.value : this.id,
      entityType:
          data.entityType.present ? data.entityType.value : this.entityType,
      entityId: data.entityId.present ? data.entityId.value : this.entityId,
      operation: data.operation.present ? data.operation.value : this.operation,
      payload: data.payload.present ? data.payload.value : this.payload,
      status: data.status.present ? data.status.value : this.status,
      retryCount:
          data.retryCount.present ? data.retryCount.value : this.retryCount,
      errorMessage: data.errorMessage.present
          ? data.errorMessage.value
          : this.errorMessage,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('SyncQueueEntry(')
          ..write('id: $id, ')
          ..write('entityType: $entityType, ')
          ..write('entityId: $entityId, ')
          ..write('operation: $operation, ')
          ..write('payload: $payload, ')
          ..write('status: $status, ')
          ..write('retryCount: $retryCount, ')
          ..write('errorMessage: $errorMessage, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, entityType, entityId, operation, payload,
      status, retryCount, errorMessage, createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is SyncQueueEntry &&
          other.id == this.id &&
          other.entityType == this.entityType &&
          other.entityId == this.entityId &&
          other.operation == this.operation &&
          other.payload == this.payload &&
          other.status == this.status &&
          other.retryCount == this.retryCount &&
          other.errorMessage == this.errorMessage &&
          other.createdAt == this.createdAt);
}

class SyncQueueTableCompanion extends UpdateCompanion<SyncQueueEntry> {
  final Value<int> id;
  final Value<String> entityType;
  final Value<String> entityId;
  final Value<String> operation;
  final Value<String> payload;
  final Value<int> status;
  final Value<int> retryCount;
  final Value<String?> errorMessage;
  final Value<DateTime> createdAt;
  const SyncQueueTableCompanion({
    this.id = const Value.absent(),
    this.entityType = const Value.absent(),
    this.entityId = const Value.absent(),
    this.operation = const Value.absent(),
    this.payload = const Value.absent(),
    this.status = const Value.absent(),
    this.retryCount = const Value.absent(),
    this.errorMessage = const Value.absent(),
    this.createdAt = const Value.absent(),
  });
  SyncQueueTableCompanion.insert({
    this.id = const Value.absent(),
    required String entityType,
    required String entityId,
    required String operation,
    required String payload,
    this.status = const Value.absent(),
    this.retryCount = const Value.absent(),
    this.errorMessage = const Value.absent(),
    this.createdAt = const Value.absent(),
  })  : entityType = Value(entityType),
        entityId = Value(entityId),
        operation = Value(operation),
        payload = Value(payload);
  static Insertable<SyncQueueEntry> custom({
    Expression<int>? id,
    Expression<String>? entityType,
    Expression<String>? entityId,
    Expression<String>? operation,
    Expression<String>? payload,
    Expression<int>? status,
    Expression<int>? retryCount,
    Expression<String>? errorMessage,
    Expression<DateTime>? createdAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (entityType != null) 'entity_type': entityType,
      if (entityId != null) 'entity_id': entityId,
      if (operation != null) 'operation': operation,
      if (payload != null) 'payload': payload,
      if (status != null) 'status': status,
      if (retryCount != null) 'retry_count': retryCount,
      if (errorMessage != null) 'error_message': errorMessage,
      if (createdAt != null) 'created_at': createdAt,
    });
  }

  SyncQueueTableCompanion copyWith(
      {Value<int>? id,
      Value<String>? entityType,
      Value<String>? entityId,
      Value<String>? operation,
      Value<String>? payload,
      Value<int>? status,
      Value<int>? retryCount,
      Value<String?>? errorMessage,
      Value<DateTime>? createdAt}) {
    return SyncQueueTableCompanion(
      id: id ?? this.id,
      entityType: entityType ?? this.entityType,
      entityId: entityId ?? this.entityId,
      operation: operation ?? this.operation,
      payload: payload ?? this.payload,
      status: status ?? this.status,
      retryCount: retryCount ?? this.retryCount,
      errorMessage: errorMessage ?? this.errorMessage,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (entityType.present) {
      map['entity_type'] = Variable<String>(entityType.value);
    }
    if (entityId.present) {
      map['entity_id'] = Variable<String>(entityId.value);
    }
    if (operation.present) {
      map['operation'] = Variable<String>(operation.value);
    }
    if (payload.present) {
      map['payload'] = Variable<String>(payload.value);
    }
    if (status.present) {
      map['status'] = Variable<int>(status.value);
    }
    if (retryCount.present) {
      map['retry_count'] = Variable<int>(retryCount.value);
    }
    if (errorMessage.present) {
      map['error_message'] = Variable<String>(errorMessage.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('SyncQueueTableCompanion(')
          ..write('id: $id, ')
          ..write('entityType: $entityType, ')
          ..write('entityId: $entityId, ')
          ..write('operation: $operation, ')
          ..write('payload: $payload, ')
          ..write('status: $status, ')
          ..write('retryCount: $retryCount, ')
          ..write('errorMessage: $errorMessage, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }
}

class $AttendanceTableTable extends AttendanceTable
    with TableInfo<$AttendanceTableTable, AttendanceEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $AttendanceTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _employeeIdMeta =
      const VerificationMeta('employeeId');
  @override
  late final GeneratedColumn<String> employeeId = GeneratedColumn<String>(
      'employee_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<DateTime> date = GeneratedColumn<DateTime>(
      'date', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _punchInTimeMeta =
      const VerificationMeta('punchInTime');
  @override
  late final GeneratedColumn<DateTime> punchInTime = GeneratedColumn<DateTime>(
      'punch_in_time', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _latitudeMeta =
      const VerificationMeta('latitude');
  @override
  late final GeneratedColumn<double> latitude = GeneratedColumn<double>(
      'latitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _longitudeMeta =
      const VerificationMeta('longitude');
  @override
  late final GeneratedColumn<double> longitude = GeneratedColumn<double>(
      'longitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _accuracyMeta =
      const VerificationMeta('accuracy');
  @override
  late final GeneratedColumn<double> accuracy = GeneratedColumn<double>(
      'accuracy', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _deviceIdMeta =
      const VerificationMeta('deviceId');
  @override
  late final GeneratedColumn<String> deviceId = GeneratedColumn<String>(
      'device_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _batteryPercentageMeta =
      const VerificationMeta('batteryPercentage');
  @override
  late final GeneratedColumn<int> batteryPercentage = GeneratedColumn<int>(
      'battery_percentage', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _networkTypeMeta =
      const VerificationMeta('networkType');
  @override
  late final GeneratedColumn<String> networkType = GeneratedColumn<String>(
      'network_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        employeeId,
        date,
        punchInTime,
        latitude,
        longitude,
        accuracy,
        deviceId,
        batteryPercentage,
        networkType,
        syncStatus,
        createdAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'attendance_table';
  @override
  VerificationContext validateIntegrity(Insertable<AttendanceEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('employee_id')) {
      context.handle(
          _employeeIdMeta,
          employeeId.isAcceptableOrUnknown(
              data['employee_id']!, _employeeIdMeta));
    } else if (isInserting) {
      context.missing(_employeeIdMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
          _dateMeta, date.isAcceptableOrUnknown(data['date']!, _dateMeta));
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('punch_in_time')) {
      context.handle(
          _punchInTimeMeta,
          punchInTime.isAcceptableOrUnknown(
              data['punch_in_time']!, _punchInTimeMeta));
    } else if (isInserting) {
      context.missing(_punchInTimeMeta);
    }
    if (data.containsKey('latitude')) {
      context.handle(_latitudeMeta,
          latitude.isAcceptableOrUnknown(data['latitude']!, _latitudeMeta));
    } else if (isInserting) {
      context.missing(_latitudeMeta);
    }
    if (data.containsKey('longitude')) {
      context.handle(_longitudeMeta,
          longitude.isAcceptableOrUnknown(data['longitude']!, _longitudeMeta));
    } else if (isInserting) {
      context.missing(_longitudeMeta);
    }
    if (data.containsKey('accuracy')) {
      context.handle(_accuracyMeta,
          accuracy.isAcceptableOrUnknown(data['accuracy']!, _accuracyMeta));
    } else if (isInserting) {
      context.missing(_accuracyMeta);
    }
    if (data.containsKey('device_id')) {
      context.handle(_deviceIdMeta,
          deviceId.isAcceptableOrUnknown(data['device_id']!, _deviceIdMeta));
    } else if (isInserting) {
      context.missing(_deviceIdMeta);
    }
    if (data.containsKey('battery_percentage')) {
      context.handle(
          _batteryPercentageMeta,
          batteryPercentage.isAcceptableOrUnknown(
              data['battery_percentage']!, _batteryPercentageMeta));
    } else if (isInserting) {
      context.missing(_batteryPercentageMeta);
    }
    if (data.containsKey('network_type')) {
      context.handle(
          _networkTypeMeta,
          networkType.isAcceptableOrUnknown(
              data['network_type']!, _networkTypeMeta));
    } else if (isInserting) {
      context.missing(_networkTypeMeta);
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  AttendanceEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return AttendanceEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      employeeId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}employee_id'])!,
      date: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}date'])!,
      punchInTime: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}punch_in_time'])!,
      latitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}latitude'])!,
      longitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}longitude'])!,
      accuracy: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}accuracy'])!,
      deviceId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}device_id'])!,
      batteryPercentage: attachedDatabase.typeMapping.read(
          DriftSqlType.int, data['${effectivePrefix}battery_percentage'])!,
      networkType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}network_type'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  $AttendanceTableTable createAlias(String alias) {
    return $AttendanceTableTable(attachedDatabase, alias);
  }
}

class AttendanceEntry extends DataClass implements Insertable<AttendanceEntry> {
  final int id;
  final String employeeId;
  final DateTime date;
  final DateTime punchInTime;
  final double latitude;
  final double longitude;
  final double accuracy;
  final String deviceId;
  final int batteryPercentage;
  final String networkType;
  final int syncStatus;
  final DateTime createdAt;
  const AttendanceEntry(
      {required this.id,
      required this.employeeId,
      required this.date,
      required this.punchInTime,
      required this.latitude,
      required this.longitude,
      required this.accuracy,
      required this.deviceId,
      required this.batteryPercentage,
      required this.networkType,
      required this.syncStatus,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['employee_id'] = Variable<String>(employeeId);
    map['date'] = Variable<DateTime>(date);
    map['punch_in_time'] = Variable<DateTime>(punchInTime);
    map['latitude'] = Variable<double>(latitude);
    map['longitude'] = Variable<double>(longitude);
    map['accuracy'] = Variable<double>(accuracy);
    map['device_id'] = Variable<String>(deviceId);
    map['battery_percentage'] = Variable<int>(batteryPercentage);
    map['network_type'] = Variable<String>(networkType);
    map['sync_status'] = Variable<int>(syncStatus);
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  AttendanceTableCompanion toCompanion(bool nullToAbsent) {
    return AttendanceTableCompanion(
      id: Value(id),
      employeeId: Value(employeeId),
      date: Value(date),
      punchInTime: Value(punchInTime),
      latitude: Value(latitude),
      longitude: Value(longitude),
      accuracy: Value(accuracy),
      deviceId: Value(deviceId),
      batteryPercentage: Value(batteryPercentage),
      networkType: Value(networkType),
      syncStatus: Value(syncStatus),
      createdAt: Value(createdAt),
    );
  }

  factory AttendanceEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return AttendanceEntry(
      id: serializer.fromJson<int>(json['id']),
      employeeId: serializer.fromJson<String>(json['employeeId']),
      date: serializer.fromJson<DateTime>(json['date']),
      punchInTime: serializer.fromJson<DateTime>(json['punchInTime']),
      latitude: serializer.fromJson<double>(json['latitude']),
      longitude: serializer.fromJson<double>(json['longitude']),
      accuracy: serializer.fromJson<double>(json['accuracy']),
      deviceId: serializer.fromJson<String>(json['deviceId']),
      batteryPercentage: serializer.fromJson<int>(json['batteryPercentage']),
      networkType: serializer.fromJson<String>(json['networkType']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'employeeId': serializer.toJson<String>(employeeId),
      'date': serializer.toJson<DateTime>(date),
      'punchInTime': serializer.toJson<DateTime>(punchInTime),
      'latitude': serializer.toJson<double>(latitude),
      'longitude': serializer.toJson<double>(longitude),
      'accuracy': serializer.toJson<double>(accuracy),
      'deviceId': serializer.toJson<String>(deviceId),
      'batteryPercentage': serializer.toJson<int>(batteryPercentage),
      'networkType': serializer.toJson<String>(networkType),
      'syncStatus': serializer.toJson<int>(syncStatus),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  AttendanceEntry copyWith(
          {int? id,
          String? employeeId,
          DateTime? date,
          DateTime? punchInTime,
          double? latitude,
          double? longitude,
          double? accuracy,
          String? deviceId,
          int? batteryPercentage,
          String? networkType,
          int? syncStatus,
          DateTime? createdAt}) =>
      AttendanceEntry(
        id: id ?? this.id,
        employeeId: employeeId ?? this.employeeId,
        date: date ?? this.date,
        punchInTime: punchInTime ?? this.punchInTime,
        latitude: latitude ?? this.latitude,
        longitude: longitude ?? this.longitude,
        accuracy: accuracy ?? this.accuracy,
        deviceId: deviceId ?? this.deviceId,
        batteryPercentage: batteryPercentage ?? this.batteryPercentage,
        networkType: networkType ?? this.networkType,
        syncStatus: syncStatus ?? this.syncStatus,
        createdAt: createdAt ?? this.createdAt,
      );
  AttendanceEntry copyWithCompanion(AttendanceTableCompanion data) {
    return AttendanceEntry(
      id: data.id.present ? data.id.value : this.id,
      employeeId:
          data.employeeId.present ? data.employeeId.value : this.employeeId,
      date: data.date.present ? data.date.value : this.date,
      punchInTime:
          data.punchInTime.present ? data.punchInTime.value : this.punchInTime,
      latitude: data.latitude.present ? data.latitude.value : this.latitude,
      longitude: data.longitude.present ? data.longitude.value : this.longitude,
      accuracy: data.accuracy.present ? data.accuracy.value : this.accuracy,
      deviceId: data.deviceId.present ? data.deviceId.value : this.deviceId,
      batteryPercentage: data.batteryPercentage.present
          ? data.batteryPercentage.value
          : this.batteryPercentage,
      networkType:
          data.networkType.present ? data.networkType.value : this.networkType,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('AttendanceEntry(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('date: $date, ')
          ..write('punchInTime: $punchInTime, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('accuracy: $accuracy, ')
          ..write('deviceId: $deviceId, ')
          ..write('batteryPercentage: $batteryPercentage, ')
          ..write('networkType: $networkType, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      employeeId,
      date,
      punchInTime,
      latitude,
      longitude,
      accuracy,
      deviceId,
      batteryPercentage,
      networkType,
      syncStatus,
      createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is AttendanceEntry &&
          other.id == this.id &&
          other.employeeId == this.employeeId &&
          other.date == this.date &&
          other.punchInTime == this.punchInTime &&
          other.latitude == this.latitude &&
          other.longitude == this.longitude &&
          other.accuracy == this.accuracy &&
          other.deviceId == this.deviceId &&
          other.batteryPercentage == this.batteryPercentage &&
          other.networkType == this.networkType &&
          other.syncStatus == this.syncStatus &&
          other.createdAt == this.createdAt);
}

class AttendanceTableCompanion extends UpdateCompanion<AttendanceEntry> {
  final Value<int> id;
  final Value<String> employeeId;
  final Value<DateTime> date;
  final Value<DateTime> punchInTime;
  final Value<double> latitude;
  final Value<double> longitude;
  final Value<double> accuracy;
  final Value<String> deviceId;
  final Value<int> batteryPercentage;
  final Value<String> networkType;
  final Value<int> syncStatus;
  final Value<DateTime> createdAt;
  const AttendanceTableCompanion({
    this.id = const Value.absent(),
    this.employeeId = const Value.absent(),
    this.date = const Value.absent(),
    this.punchInTime = const Value.absent(),
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.accuracy = const Value.absent(),
    this.deviceId = const Value.absent(),
    this.batteryPercentage = const Value.absent(),
    this.networkType = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  });
  AttendanceTableCompanion.insert({
    this.id = const Value.absent(),
    required String employeeId,
    required DateTime date,
    required DateTime punchInTime,
    required double latitude,
    required double longitude,
    required double accuracy,
    required String deviceId,
    required int batteryPercentage,
    required String networkType,
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  })  : employeeId = Value(employeeId),
        date = Value(date),
        punchInTime = Value(punchInTime),
        latitude = Value(latitude),
        longitude = Value(longitude),
        accuracy = Value(accuracy),
        deviceId = Value(deviceId),
        batteryPercentage = Value(batteryPercentage),
        networkType = Value(networkType);
  static Insertable<AttendanceEntry> custom({
    Expression<int>? id,
    Expression<String>? employeeId,
    Expression<DateTime>? date,
    Expression<DateTime>? punchInTime,
    Expression<double>? latitude,
    Expression<double>? longitude,
    Expression<double>? accuracy,
    Expression<String>? deviceId,
    Expression<int>? batteryPercentage,
    Expression<String>? networkType,
    Expression<int>? syncStatus,
    Expression<DateTime>? createdAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (employeeId != null) 'employee_id': employeeId,
      if (date != null) 'date': date,
      if (punchInTime != null) 'punch_in_time': punchInTime,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (accuracy != null) 'accuracy': accuracy,
      if (deviceId != null) 'device_id': deviceId,
      if (batteryPercentage != null) 'battery_percentage': batteryPercentage,
      if (networkType != null) 'network_type': networkType,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (createdAt != null) 'created_at': createdAt,
    });
  }

  AttendanceTableCompanion copyWith(
      {Value<int>? id,
      Value<String>? employeeId,
      Value<DateTime>? date,
      Value<DateTime>? punchInTime,
      Value<double>? latitude,
      Value<double>? longitude,
      Value<double>? accuracy,
      Value<String>? deviceId,
      Value<int>? batteryPercentage,
      Value<String>? networkType,
      Value<int>? syncStatus,
      Value<DateTime>? createdAt}) {
    return AttendanceTableCompanion(
      id: id ?? this.id,
      employeeId: employeeId ?? this.employeeId,
      date: date ?? this.date,
      punchInTime: punchInTime ?? this.punchInTime,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      accuracy: accuracy ?? this.accuracy,
      deviceId: deviceId ?? this.deviceId,
      batteryPercentage: batteryPercentage ?? this.batteryPercentage,
      networkType: networkType ?? this.networkType,
      syncStatus: syncStatus ?? this.syncStatus,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (employeeId.present) {
      map['employee_id'] = Variable<String>(employeeId.value);
    }
    if (date.present) {
      map['date'] = Variable<DateTime>(date.value);
    }
    if (punchInTime.present) {
      map['punch_in_time'] = Variable<DateTime>(punchInTime.value);
    }
    if (latitude.present) {
      map['latitude'] = Variable<double>(latitude.value);
    }
    if (longitude.present) {
      map['longitude'] = Variable<double>(longitude.value);
    }
    if (accuracy.present) {
      map['accuracy'] = Variable<double>(accuracy.value);
    }
    if (deviceId.present) {
      map['device_id'] = Variable<String>(deviceId.value);
    }
    if (batteryPercentage.present) {
      map['battery_percentage'] = Variable<int>(batteryPercentage.value);
    }
    if (networkType.present) {
      map['network_type'] = Variable<String>(networkType.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('AttendanceTableCompanion(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('date: $date, ')
          ..write('punchInTime: $punchInTime, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('accuracy: $accuracy, ')
          ..write('deviceId: $deviceId, ')
          ..write('batteryPercentage: $batteryPercentage, ')
          ..write('networkType: $networkType, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }
}

class $CustomerTableTable extends CustomerTable
    with TableInfo<$CustomerTableTable, CustomerEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CustomerTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
      'name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _typeMeta = const VerificationMeta('type');
  @override
  late final GeneratedColumn<String> type = GeneratedColumn<String>(
      'type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _specialtyMeta =
      const VerificationMeta('specialty');
  @override
  late final GeneratedColumn<String> specialty = GeneratedColumn<String>(
      'specialty', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _qualificationMeta =
      const VerificationMeta('qualification');
  @override
  late final GeneratedColumn<String> qualification = GeneratedColumn<String>(
      'qualification', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _mobileMeta = const VerificationMeta('mobile');
  @override
  late final GeneratedColumn<String> mobile = GeneratedColumn<String>(
      'mobile', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _addressMeta =
      const VerificationMeta('address');
  @override
  late final GeneratedColumn<String> address = GeneratedColumn<String>(
      'address', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _latitudeMeta =
      const VerificationMeta('latitude');
  @override
  late final GeneratedColumn<double> latitude = GeneratedColumn<double>(
      'latitude', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _longitudeMeta =
      const VerificationMeta('longitude');
  @override
  late final GeneratedColumn<double> longitude = GeneratedColumn<double>(
      'longitude', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _areaMeta = const VerificationMeta('area');
  @override
  late final GeneratedColumn<String> area = GeneratedColumn<String>(
      'area', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _cityMeta = const VerificationMeta('city');
  @override
  late final GeneratedColumn<String> city = GeneratedColumn<String>(
      'city', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _stateMeta = const VerificationMeta('state');
  @override
  late final GeneratedColumn<String> state = GeneratedColumn<String>(
      'state', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _pincodeMeta =
      const VerificationMeta('pincode');
  @override
  late final GeneratedColumn<String> pincode = GeneratedColumn<String>(
      'pincode', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _classificationMeta =
      const VerificationMeta('classification');
  @override
  late final GeneratedColumn<String> classification = GeneratedColumn<String>(
      'classification', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
      'status', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('APPROVED'));
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns => [
        id,
        name,
        type,
        specialty,
        qualification,
        mobile,
        address,
        latitude,
        longitude,
        area,
        city,
        state,
        pincode,
        classification,
        status,
        syncStatus
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'customer_table';
  @override
  VerificationContext validateIntegrity(Insertable<CustomerEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
          _nameMeta, name.isAcceptableOrUnknown(data['name']!, _nameMeta));
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('type')) {
      context.handle(
          _typeMeta, type.isAcceptableOrUnknown(data['type']!, _typeMeta));
    } else if (isInserting) {
      context.missing(_typeMeta);
    }
    if (data.containsKey('specialty')) {
      context.handle(_specialtyMeta,
          specialty.isAcceptableOrUnknown(data['specialty']!, _specialtyMeta));
    }
    if (data.containsKey('qualification')) {
      context.handle(
          _qualificationMeta,
          qualification.isAcceptableOrUnknown(
              data['qualification']!, _qualificationMeta));
    }
    if (data.containsKey('mobile')) {
      context.handle(_mobileMeta,
          mobile.isAcceptableOrUnknown(data['mobile']!, _mobileMeta));
    }
    if (data.containsKey('address')) {
      context.handle(_addressMeta,
          address.isAcceptableOrUnknown(data['address']!, _addressMeta));
    }
    if (data.containsKey('latitude')) {
      context.handle(_latitudeMeta,
          latitude.isAcceptableOrUnknown(data['latitude']!, _latitudeMeta));
    }
    if (data.containsKey('longitude')) {
      context.handle(_longitudeMeta,
          longitude.isAcceptableOrUnknown(data['longitude']!, _longitudeMeta));
    }
    if (data.containsKey('area')) {
      context.handle(
          _areaMeta, area.isAcceptableOrUnknown(data['area']!, _areaMeta));
    }
    if (data.containsKey('city')) {
      context.handle(
          _cityMeta, city.isAcceptableOrUnknown(data['city']!, _cityMeta));
    }
    if (data.containsKey('state')) {
      context.handle(
          _stateMeta, state.isAcceptableOrUnknown(data['state']!, _stateMeta));
    }
    if (data.containsKey('pincode')) {
      context.handle(_pincodeMeta,
          pincode.isAcceptableOrUnknown(data['pincode']!, _pincodeMeta));
    }
    if (data.containsKey('classification')) {
      context.handle(
          _classificationMeta,
          classification.isAcceptableOrUnknown(
              data['classification']!, _classificationMeta));
    }
    if (data.containsKey('status')) {
      context.handle(_statusMeta,
          status.isAcceptableOrUnknown(data['status']!, _statusMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CustomerEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CustomerEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      name: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}name'])!,
      type: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}type'])!,
      specialty: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}specialty']),
      qualification: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}qualification']),
      mobile: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}mobile']),
      address: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}address']),
      latitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}latitude']),
      longitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}longitude']),
      area: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}area']),
      city: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}city']),
      state: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}state']),
      pincode: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}pincode']),
      classification: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}classification']),
      status: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}status'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $CustomerTableTable createAlias(String alias) {
    return $CustomerTableTable(attachedDatabase, alias);
  }
}

class CustomerEntry extends DataClass implements Insertable<CustomerEntry> {
  final String id;
  final String name;
  final String type;
  final String? specialty;
  final String? qualification;
  final String? mobile;
  final String? address;
  final double? latitude;
  final double? longitude;
  final String? area;
  final String? city;
  final String? state;
  final String? pincode;
  final String? classification;
  final String status;
  final int syncStatus;
  const CustomerEntry(
      {required this.id,
      required this.name,
      required this.type,
      this.specialty,
      this.qualification,
      this.mobile,
      this.address,
      this.latitude,
      this.longitude,
      this.area,
      this.city,
      this.state,
      this.pincode,
      this.classification,
      required this.status,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    map['type'] = Variable<String>(type);
    if (!nullToAbsent || specialty != null) {
      map['specialty'] = Variable<String>(specialty);
    }
    if (!nullToAbsent || qualification != null) {
      map['qualification'] = Variable<String>(qualification);
    }
    if (!nullToAbsent || mobile != null) {
      map['mobile'] = Variable<String>(mobile);
    }
    if (!nullToAbsent || address != null) {
      map['address'] = Variable<String>(address);
    }
    if (!nullToAbsent || latitude != null) {
      map['latitude'] = Variable<double>(latitude);
    }
    if (!nullToAbsent || longitude != null) {
      map['longitude'] = Variable<double>(longitude);
    }
    if (!nullToAbsent || area != null) {
      map['area'] = Variable<String>(area);
    }
    if (!nullToAbsent || city != null) {
      map['city'] = Variable<String>(city);
    }
    if (!nullToAbsent || state != null) {
      map['state'] = Variable<String>(state);
    }
    if (!nullToAbsent || pincode != null) {
      map['pincode'] = Variable<String>(pincode);
    }
    if (!nullToAbsent || classification != null) {
      map['classification'] = Variable<String>(classification);
    }
    map['status'] = Variable<String>(status);
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  CustomerTableCompanion toCompanion(bool nullToAbsent) {
    return CustomerTableCompanion(
      id: Value(id),
      name: Value(name),
      type: Value(type),
      specialty: specialty == null && nullToAbsent
          ? const Value.absent()
          : Value(specialty),
      qualification: qualification == null && nullToAbsent
          ? const Value.absent()
          : Value(qualification),
      mobile:
          mobile == null && nullToAbsent ? const Value.absent() : Value(mobile),
      address: address == null && nullToAbsent
          ? const Value.absent()
          : Value(address),
      latitude: latitude == null && nullToAbsent
          ? const Value.absent()
          : Value(latitude),
      longitude: longitude == null && nullToAbsent
          ? const Value.absent()
          : Value(longitude),
      area: area == null && nullToAbsent ? const Value.absent() : Value(area),
      city: city == null && nullToAbsent ? const Value.absent() : Value(city),
      state:
          state == null && nullToAbsent ? const Value.absent() : Value(state),
      pincode: pincode == null && nullToAbsent
          ? const Value.absent()
          : Value(pincode),
      classification: classification == null && nullToAbsent
          ? const Value.absent()
          : Value(classification),
      status: Value(status),
      syncStatus: Value(syncStatus),
    );
  }

  factory CustomerEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CustomerEntry(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      type: serializer.fromJson<String>(json['type']),
      specialty: serializer.fromJson<String?>(json['specialty']),
      qualification: serializer.fromJson<String?>(json['qualification']),
      mobile: serializer.fromJson<String?>(json['mobile']),
      address: serializer.fromJson<String?>(json['address']),
      latitude: serializer.fromJson<double?>(json['latitude']),
      longitude: serializer.fromJson<double?>(json['longitude']),
      area: serializer.fromJson<String?>(json['area']),
      city: serializer.fromJson<String?>(json['city']),
      state: serializer.fromJson<String?>(json['state']),
      pincode: serializer.fromJson<String?>(json['pincode']),
      classification: serializer.fromJson<String?>(json['classification']),
      status: serializer.fromJson<String>(json['status']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'type': serializer.toJson<String>(type),
      'specialty': serializer.toJson<String?>(specialty),
      'qualification': serializer.toJson<String?>(qualification),
      'mobile': serializer.toJson<String?>(mobile),
      'address': serializer.toJson<String?>(address),
      'latitude': serializer.toJson<double?>(latitude),
      'longitude': serializer.toJson<double?>(longitude),
      'area': serializer.toJson<String?>(area),
      'city': serializer.toJson<String?>(city),
      'state': serializer.toJson<String?>(state),
      'pincode': serializer.toJson<String?>(pincode),
      'classification': serializer.toJson<String?>(classification),
      'status': serializer.toJson<String>(status),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  CustomerEntry copyWith(
          {String? id,
          String? name,
          String? type,
          Value<String?> specialty = const Value.absent(),
          Value<String?> qualification = const Value.absent(),
          Value<String?> mobile = const Value.absent(),
          Value<String?> address = const Value.absent(),
          Value<double?> latitude = const Value.absent(),
          Value<double?> longitude = const Value.absent(),
          Value<String?> area = const Value.absent(),
          Value<String?> city = const Value.absent(),
          Value<String?> state = const Value.absent(),
          Value<String?> pincode = const Value.absent(),
          Value<String?> classification = const Value.absent(),
          String? status,
          int? syncStatus}) =>
      CustomerEntry(
        id: id ?? this.id,
        name: name ?? this.name,
        type: type ?? this.type,
        specialty: specialty.present ? specialty.value : this.specialty,
        qualification:
            qualification.present ? qualification.value : this.qualification,
        mobile: mobile.present ? mobile.value : this.mobile,
        address: address.present ? address.value : this.address,
        latitude: latitude.present ? latitude.value : this.latitude,
        longitude: longitude.present ? longitude.value : this.longitude,
        area: area.present ? area.value : this.area,
        city: city.present ? city.value : this.city,
        state: state.present ? state.value : this.state,
        pincode: pincode.present ? pincode.value : this.pincode,
        classification:
            classification.present ? classification.value : this.classification,
        status: status ?? this.status,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  CustomerEntry copyWithCompanion(CustomerTableCompanion data) {
    return CustomerEntry(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      type: data.type.present ? data.type.value : this.type,
      specialty: data.specialty.present ? data.specialty.value : this.specialty,
      qualification: data.qualification.present
          ? data.qualification.value
          : this.qualification,
      mobile: data.mobile.present ? data.mobile.value : this.mobile,
      address: data.address.present ? data.address.value : this.address,
      latitude: data.latitude.present ? data.latitude.value : this.latitude,
      longitude: data.longitude.present ? data.longitude.value : this.longitude,
      area: data.area.present ? data.area.value : this.area,
      city: data.city.present ? data.city.value : this.city,
      state: data.state.present ? data.state.value : this.state,
      pincode: data.pincode.present ? data.pincode.value : this.pincode,
      classification: data.classification.present
          ? data.classification.value
          : this.classification,
      status: data.status.present ? data.status.value : this.status,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CustomerEntry(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('type: $type, ')
          ..write('specialty: $specialty, ')
          ..write('qualification: $qualification, ')
          ..write('mobile: $mobile, ')
          ..write('address: $address, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('area: $area, ')
          ..write('city: $city, ')
          ..write('state: $state, ')
          ..write('pincode: $pincode, ')
          ..write('classification: $classification, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      name,
      type,
      specialty,
      qualification,
      mobile,
      address,
      latitude,
      longitude,
      area,
      city,
      state,
      pincode,
      classification,
      status,
      syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CustomerEntry &&
          other.id == this.id &&
          other.name == this.name &&
          other.type == this.type &&
          other.specialty == this.specialty &&
          other.qualification == this.qualification &&
          other.mobile == this.mobile &&
          other.address == this.address &&
          other.latitude == this.latitude &&
          other.longitude == this.longitude &&
          other.area == this.area &&
          other.city == this.city &&
          other.state == this.state &&
          other.pincode == this.pincode &&
          other.classification == this.classification &&
          other.status == this.status &&
          other.syncStatus == this.syncStatus);
}

class CustomerTableCompanion extends UpdateCompanion<CustomerEntry> {
  final Value<String> id;
  final Value<String> name;
  final Value<String> type;
  final Value<String?> specialty;
  final Value<String?> qualification;
  final Value<String?> mobile;
  final Value<String?> address;
  final Value<double?> latitude;
  final Value<double?> longitude;
  final Value<String?> area;
  final Value<String?> city;
  final Value<String?> state;
  final Value<String?> pincode;
  final Value<String?> classification;
  final Value<String> status;
  final Value<int> syncStatus;
  final Value<int> rowid;
  const CustomerTableCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.type = const Value.absent(),
    this.specialty = const Value.absent(),
    this.qualification = const Value.absent(),
    this.mobile = const Value.absent(),
    this.address = const Value.absent(),
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.area = const Value.absent(),
    this.city = const Value.absent(),
    this.state = const Value.absent(),
    this.pincode = const Value.absent(),
    this.classification = const Value.absent(),
    this.status = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CustomerTableCompanion.insert({
    required String id,
    required String name,
    required String type,
    this.specialty = const Value.absent(),
    this.qualification = const Value.absent(),
    this.mobile = const Value.absent(),
    this.address = const Value.absent(),
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.area = const Value.absent(),
    this.city = const Value.absent(),
    this.state = const Value.absent(),
    this.pincode = const Value.absent(),
    this.classification = const Value.absent(),
    this.status = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        name = Value(name),
        type = Value(type);
  static Insertable<CustomerEntry> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<String>? type,
    Expression<String>? specialty,
    Expression<String>? qualification,
    Expression<String>? mobile,
    Expression<String>? address,
    Expression<double>? latitude,
    Expression<double>? longitude,
    Expression<String>? area,
    Expression<String>? city,
    Expression<String>? state,
    Expression<String>? pincode,
    Expression<String>? classification,
    Expression<String>? status,
    Expression<int>? syncStatus,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (type != null) 'type': type,
      if (specialty != null) 'specialty': specialty,
      if (qualification != null) 'qualification': qualification,
      if (mobile != null) 'mobile': mobile,
      if (address != null) 'address': address,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (area != null) 'area': area,
      if (city != null) 'city': city,
      if (state != null) 'state': state,
      if (pincode != null) 'pincode': pincode,
      if (classification != null) 'classification': classification,
      if (status != null) 'status': status,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CustomerTableCompanion copyWith(
      {Value<String>? id,
      Value<String>? name,
      Value<String>? type,
      Value<String?>? specialty,
      Value<String?>? qualification,
      Value<String?>? mobile,
      Value<String?>? address,
      Value<double?>? latitude,
      Value<double?>? longitude,
      Value<String?>? area,
      Value<String?>? city,
      Value<String?>? state,
      Value<String?>? pincode,
      Value<String?>? classification,
      Value<String>? status,
      Value<int>? syncStatus,
      Value<int>? rowid}) {
    return CustomerTableCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      type: type ?? this.type,
      specialty: specialty ?? this.specialty,
      qualification: qualification ?? this.qualification,
      mobile: mobile ?? this.mobile,
      address: address ?? this.address,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      area: area ?? this.area,
      city: city ?? this.city,
      state: state ?? this.state,
      pincode: pincode ?? this.pincode,
      classification: classification ?? this.classification,
      status: status ?? this.status,
      syncStatus: syncStatus ?? this.syncStatus,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (type.present) {
      map['type'] = Variable<String>(type.value);
    }
    if (specialty.present) {
      map['specialty'] = Variable<String>(specialty.value);
    }
    if (qualification.present) {
      map['qualification'] = Variable<String>(qualification.value);
    }
    if (mobile.present) {
      map['mobile'] = Variable<String>(mobile.value);
    }
    if (address.present) {
      map['address'] = Variable<String>(address.value);
    }
    if (latitude.present) {
      map['latitude'] = Variable<double>(latitude.value);
    }
    if (longitude.present) {
      map['longitude'] = Variable<double>(longitude.value);
    }
    if (area.present) {
      map['area'] = Variable<String>(area.value);
    }
    if (city.present) {
      map['city'] = Variable<String>(city.value);
    }
    if (state.present) {
      map['state'] = Variable<String>(state.value);
    }
    if (pincode.present) {
      map['pincode'] = Variable<String>(pincode.value);
    }
    if (classification.present) {
      map['classification'] = Variable<String>(classification.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CustomerTableCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('type: $type, ')
          ..write('specialty: $specialty, ')
          ..write('qualification: $qualification, ')
          ..write('mobile: $mobile, ')
          ..write('address: $address, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('area: $area, ')
          ..write('city: $city, ')
          ..write('state: $state, ')
          ..write('pincode: $pincode, ')
          ..write('classification: $classification, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $DcrCheckInTableTable extends DcrCheckInTable
    with TableInfo<$DcrCheckInTableTable, DcrCheckInEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DcrCheckInTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _employeeIdMeta =
      const VerificationMeta('employeeId');
  @override
  late final GeneratedColumn<String> employeeId = GeneratedColumn<String>(
      'employee_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerIdMeta =
      const VerificationMeta('customerId');
  @override
  late final GeneratedColumn<String> customerId = GeneratedColumn<String>(
      'customer_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<DateTime> date = GeneratedColumn<DateTime>(
      'date', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _checkInTimeMeta =
      const VerificationMeta('checkInTime');
  @override
  late final GeneratedColumn<DateTime> checkInTime = GeneratedColumn<DateTime>(
      'check_in_time', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _latitudeMeta =
      const VerificationMeta('latitude');
  @override
  late final GeneratedColumn<double> latitude = GeneratedColumn<double>(
      'latitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _longitudeMeta =
      const VerificationMeta('longitude');
  @override
  late final GeneratedColumn<double> longitude = GeneratedColumn<double>(
      'longitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _accuracyMeta =
      const VerificationMeta('accuracy');
  @override
  late final GeneratedColumn<double> accuracy = GeneratedColumn<double>(
      'accuracy', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _distanceMeta =
      const VerificationMeta('distance');
  @override
  late final GeneratedColumn<double> distance = GeneratedColumn<double>(
      'distance', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _deviceIdMeta =
      const VerificationMeta('deviceId');
  @override
  late final GeneratedColumn<String> deviceId = GeneratedColumn<String>(
      'device_id', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _isInternetAvailableMeta =
      const VerificationMeta('isInternetAvailable');
  @override
  late final GeneratedColumn<bool> isInternetAvailable = GeneratedColumn<bool>(
      'is_internet_available', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints: GeneratedColumn.constraintIsAlways(
          'CHECK ("is_internet_available" IN (0, 1))'),
      defaultValue: const Constant(true));
  static const VerificationMeta _batteryPercentageMeta =
      const VerificationMeta('batteryPercentage');
  @override
  late final GeneratedColumn<int> batteryPercentage = GeneratedColumn<int>(
      'battery_percentage', aliasedName, true,
      type: DriftSqlType.int, requiredDuringInsert: false);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _callIdMeta = const VerificationMeta('callId');
  @override
  late final GeneratedColumn<String> callId = GeneratedColumn<String>(
      'call_id', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        employeeId,
        customerId,
        date,
        checkInTime,
        latitude,
        longitude,
        accuracy,
        distance,
        deviceId,
        isInternetAvailable,
        batteryPercentage,
        syncStatus,
        callId
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'dcr_check_in_table';
  @override
  VerificationContext validateIntegrity(Insertable<DcrCheckInEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('employee_id')) {
      context.handle(
          _employeeIdMeta,
          employeeId.isAcceptableOrUnknown(
              data['employee_id']!, _employeeIdMeta));
    } else if (isInserting) {
      context.missing(_employeeIdMeta);
    }
    if (data.containsKey('customer_id')) {
      context.handle(
          _customerIdMeta,
          customerId.isAcceptableOrUnknown(
              data['customer_id']!, _customerIdMeta));
    } else if (isInserting) {
      context.missing(_customerIdMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
          _dateMeta, date.isAcceptableOrUnknown(data['date']!, _dateMeta));
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('check_in_time')) {
      context.handle(
          _checkInTimeMeta,
          checkInTime.isAcceptableOrUnknown(
              data['check_in_time']!, _checkInTimeMeta));
    } else if (isInserting) {
      context.missing(_checkInTimeMeta);
    }
    if (data.containsKey('latitude')) {
      context.handle(_latitudeMeta,
          latitude.isAcceptableOrUnknown(data['latitude']!, _latitudeMeta));
    } else if (isInserting) {
      context.missing(_latitudeMeta);
    }
    if (data.containsKey('longitude')) {
      context.handle(_longitudeMeta,
          longitude.isAcceptableOrUnknown(data['longitude']!, _longitudeMeta));
    } else if (isInserting) {
      context.missing(_longitudeMeta);
    }
    if (data.containsKey('accuracy')) {
      context.handle(_accuracyMeta,
          accuracy.isAcceptableOrUnknown(data['accuracy']!, _accuracyMeta));
    } else if (isInserting) {
      context.missing(_accuracyMeta);
    }
    if (data.containsKey('distance')) {
      context.handle(_distanceMeta,
          distance.isAcceptableOrUnknown(data['distance']!, _distanceMeta));
    } else if (isInserting) {
      context.missing(_distanceMeta);
    }
    if (data.containsKey('device_id')) {
      context.handle(_deviceIdMeta,
          deviceId.isAcceptableOrUnknown(data['device_id']!, _deviceIdMeta));
    }
    if (data.containsKey('is_internet_available')) {
      context.handle(
          _isInternetAvailableMeta,
          isInternetAvailable.isAcceptableOrUnknown(
              data['is_internet_available']!, _isInternetAvailableMeta));
    }
    if (data.containsKey('battery_percentage')) {
      context.handle(
          _batteryPercentageMeta,
          batteryPercentage.isAcceptableOrUnknown(
              data['battery_percentage']!, _batteryPercentageMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    if (data.containsKey('call_id')) {
      context.handle(_callIdMeta,
          callId.isAcceptableOrUnknown(data['call_id']!, _callIdMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  DcrCheckInEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return DcrCheckInEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      employeeId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}employee_id'])!,
      customerId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_id'])!,
      date: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}date'])!,
      checkInTime: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}check_in_time'])!,
      latitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}latitude'])!,
      longitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}longitude'])!,
      accuracy: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}accuracy'])!,
      distance: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}distance'])!,
      deviceId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}device_id']),
      isInternetAvailable: attachedDatabase.typeMapping.read(
          DriftSqlType.bool, data['${effectivePrefix}is_internet_available'])!,
      batteryPercentage: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}battery_percentage']),
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
      callId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}call_id']),
    );
  }

  @override
  $DcrCheckInTableTable createAlias(String alias) {
    return $DcrCheckInTableTable(attachedDatabase, alias);
  }
}

class DcrCheckInEntry extends DataClass implements Insertable<DcrCheckInEntry> {
  final int id;
  final String employeeId;
  final String customerId;
  final DateTime date;
  final DateTime checkInTime;
  final double latitude;
  final double longitude;
  final double accuracy;
  final double distance;
  final String? deviceId;
  final bool isInternetAvailable;
  final int? batteryPercentage;
  final int syncStatus;
  final String? callId;
  const DcrCheckInEntry(
      {required this.id,
      required this.employeeId,
      required this.customerId,
      required this.date,
      required this.checkInTime,
      required this.latitude,
      required this.longitude,
      required this.accuracy,
      required this.distance,
      this.deviceId,
      required this.isInternetAvailable,
      this.batteryPercentage,
      required this.syncStatus,
      this.callId});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['employee_id'] = Variable<String>(employeeId);
    map['customer_id'] = Variable<String>(customerId);
    map['date'] = Variable<DateTime>(date);
    map['check_in_time'] = Variable<DateTime>(checkInTime);
    map['latitude'] = Variable<double>(latitude);
    map['longitude'] = Variable<double>(longitude);
    map['accuracy'] = Variable<double>(accuracy);
    map['distance'] = Variable<double>(distance);
    if (!nullToAbsent || deviceId != null) {
      map['device_id'] = Variable<String>(deviceId);
    }
    map['is_internet_available'] = Variable<bool>(isInternetAvailable);
    if (!nullToAbsent || batteryPercentage != null) {
      map['battery_percentage'] = Variable<int>(batteryPercentage);
    }
    map['sync_status'] = Variable<int>(syncStatus);
    if (!nullToAbsent || callId != null) {
      map['call_id'] = Variable<String>(callId);
    }
    return map;
  }

  DcrCheckInTableCompanion toCompanion(bool nullToAbsent) {
    return DcrCheckInTableCompanion(
      id: Value(id),
      employeeId: Value(employeeId),
      customerId: Value(customerId),
      date: Value(date),
      checkInTime: Value(checkInTime),
      latitude: Value(latitude),
      longitude: Value(longitude),
      accuracy: Value(accuracy),
      distance: Value(distance),
      deviceId: deviceId == null && nullToAbsent
          ? const Value.absent()
          : Value(deviceId),
      isInternetAvailable: Value(isInternetAvailable),
      batteryPercentage: batteryPercentage == null && nullToAbsent
          ? const Value.absent()
          : Value(batteryPercentage),
      syncStatus: Value(syncStatus),
      callId:
          callId == null && nullToAbsent ? const Value.absent() : Value(callId),
    );
  }

  factory DcrCheckInEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return DcrCheckInEntry(
      id: serializer.fromJson<int>(json['id']),
      employeeId: serializer.fromJson<String>(json['employeeId']),
      customerId: serializer.fromJson<String>(json['customerId']),
      date: serializer.fromJson<DateTime>(json['date']),
      checkInTime: serializer.fromJson<DateTime>(json['checkInTime']),
      latitude: serializer.fromJson<double>(json['latitude']),
      longitude: serializer.fromJson<double>(json['longitude']),
      accuracy: serializer.fromJson<double>(json['accuracy']),
      distance: serializer.fromJson<double>(json['distance']),
      deviceId: serializer.fromJson<String?>(json['deviceId']),
      isInternetAvailable:
          serializer.fromJson<bool>(json['isInternetAvailable']),
      batteryPercentage: serializer.fromJson<int?>(json['batteryPercentage']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
      callId: serializer.fromJson<String?>(json['callId']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'employeeId': serializer.toJson<String>(employeeId),
      'customerId': serializer.toJson<String>(customerId),
      'date': serializer.toJson<DateTime>(date),
      'checkInTime': serializer.toJson<DateTime>(checkInTime),
      'latitude': serializer.toJson<double>(latitude),
      'longitude': serializer.toJson<double>(longitude),
      'accuracy': serializer.toJson<double>(accuracy),
      'distance': serializer.toJson<double>(distance),
      'deviceId': serializer.toJson<String?>(deviceId),
      'isInternetAvailable': serializer.toJson<bool>(isInternetAvailable),
      'batteryPercentage': serializer.toJson<int?>(batteryPercentage),
      'syncStatus': serializer.toJson<int>(syncStatus),
      'callId': serializer.toJson<String?>(callId),
    };
  }

  DcrCheckInEntry copyWith(
          {int? id,
          String? employeeId,
          String? customerId,
          DateTime? date,
          DateTime? checkInTime,
          double? latitude,
          double? longitude,
          double? accuracy,
          double? distance,
          Value<String?> deviceId = const Value.absent(),
          bool? isInternetAvailable,
          Value<int?> batteryPercentage = const Value.absent(),
          int? syncStatus,
          Value<String?> callId = const Value.absent()}) =>
      DcrCheckInEntry(
        id: id ?? this.id,
        employeeId: employeeId ?? this.employeeId,
        customerId: customerId ?? this.customerId,
        date: date ?? this.date,
        checkInTime: checkInTime ?? this.checkInTime,
        latitude: latitude ?? this.latitude,
        longitude: longitude ?? this.longitude,
        accuracy: accuracy ?? this.accuracy,
        distance: distance ?? this.distance,
        deviceId: deviceId.present ? deviceId.value : this.deviceId,
        isInternetAvailable: isInternetAvailable ?? this.isInternetAvailable,
        batteryPercentage: batteryPercentage.present
            ? batteryPercentage.value
            : this.batteryPercentage,
        syncStatus: syncStatus ?? this.syncStatus,
        callId: callId.present ? callId.value : this.callId,
      );
  DcrCheckInEntry copyWithCompanion(DcrCheckInTableCompanion data) {
    return DcrCheckInEntry(
      id: data.id.present ? data.id.value : this.id,
      employeeId:
          data.employeeId.present ? data.employeeId.value : this.employeeId,
      customerId:
          data.customerId.present ? data.customerId.value : this.customerId,
      date: data.date.present ? data.date.value : this.date,
      checkInTime:
          data.checkInTime.present ? data.checkInTime.value : this.checkInTime,
      latitude: data.latitude.present ? data.latitude.value : this.latitude,
      longitude: data.longitude.present ? data.longitude.value : this.longitude,
      accuracy: data.accuracy.present ? data.accuracy.value : this.accuracy,
      distance: data.distance.present ? data.distance.value : this.distance,
      deviceId: data.deviceId.present ? data.deviceId.value : this.deviceId,
      isInternetAvailable: data.isInternetAvailable.present
          ? data.isInternetAvailable.value
          : this.isInternetAvailable,
      batteryPercentage: data.batteryPercentage.present
          ? data.batteryPercentage.value
          : this.batteryPercentage,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
      callId: data.callId.present ? data.callId.value : this.callId,
    );
  }

  @override
  String toString() {
    return (StringBuffer('DcrCheckInEntry(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('customerId: $customerId, ')
          ..write('date: $date, ')
          ..write('checkInTime: $checkInTime, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('accuracy: $accuracy, ')
          ..write('distance: $distance, ')
          ..write('deviceId: $deviceId, ')
          ..write('isInternetAvailable: $isInternetAvailable, ')
          ..write('batteryPercentage: $batteryPercentage, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('callId: $callId')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      employeeId,
      customerId,
      date,
      checkInTime,
      latitude,
      longitude,
      accuracy,
      distance,
      deviceId,
      isInternetAvailable,
      batteryPercentage,
      syncStatus,
      callId);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is DcrCheckInEntry &&
          other.id == this.id &&
          other.employeeId == this.employeeId &&
          other.customerId == this.customerId &&
          other.date == this.date &&
          other.checkInTime == this.checkInTime &&
          other.latitude == this.latitude &&
          other.longitude == this.longitude &&
          other.accuracy == this.accuracy &&
          other.distance == this.distance &&
          other.deviceId == this.deviceId &&
          other.isInternetAvailable == this.isInternetAvailable &&
          other.batteryPercentage == this.batteryPercentage &&
          other.syncStatus == this.syncStatus &&
          other.callId == this.callId);
}

class DcrCheckInTableCompanion extends UpdateCompanion<DcrCheckInEntry> {
  final Value<int> id;
  final Value<String> employeeId;
  final Value<String> customerId;
  final Value<DateTime> date;
  final Value<DateTime> checkInTime;
  final Value<double> latitude;
  final Value<double> longitude;
  final Value<double> accuracy;
  final Value<double> distance;
  final Value<String?> deviceId;
  final Value<bool> isInternetAvailable;
  final Value<int?> batteryPercentage;
  final Value<int> syncStatus;
  final Value<String?> callId;
  const DcrCheckInTableCompanion({
    this.id = const Value.absent(),
    this.employeeId = const Value.absent(),
    this.customerId = const Value.absent(),
    this.date = const Value.absent(),
    this.checkInTime = const Value.absent(),
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.accuracy = const Value.absent(),
    this.distance = const Value.absent(),
    this.deviceId = const Value.absent(),
    this.isInternetAvailable = const Value.absent(),
    this.batteryPercentage = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.callId = const Value.absent(),
  });
  DcrCheckInTableCompanion.insert({
    this.id = const Value.absent(),
    required String employeeId,
    required String customerId,
    required DateTime date,
    required DateTime checkInTime,
    required double latitude,
    required double longitude,
    required double accuracy,
    required double distance,
    this.deviceId = const Value.absent(),
    this.isInternetAvailable = const Value.absent(),
    this.batteryPercentage = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.callId = const Value.absent(),
  })  : employeeId = Value(employeeId),
        customerId = Value(customerId),
        date = Value(date),
        checkInTime = Value(checkInTime),
        latitude = Value(latitude),
        longitude = Value(longitude),
        accuracy = Value(accuracy),
        distance = Value(distance);
  static Insertable<DcrCheckInEntry> custom({
    Expression<int>? id,
    Expression<String>? employeeId,
    Expression<String>? customerId,
    Expression<DateTime>? date,
    Expression<DateTime>? checkInTime,
    Expression<double>? latitude,
    Expression<double>? longitude,
    Expression<double>? accuracy,
    Expression<double>? distance,
    Expression<String>? deviceId,
    Expression<bool>? isInternetAvailable,
    Expression<int>? batteryPercentage,
    Expression<int>? syncStatus,
    Expression<String>? callId,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (employeeId != null) 'employee_id': employeeId,
      if (customerId != null) 'customer_id': customerId,
      if (date != null) 'date': date,
      if (checkInTime != null) 'check_in_time': checkInTime,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (accuracy != null) 'accuracy': accuracy,
      if (distance != null) 'distance': distance,
      if (deviceId != null) 'device_id': deviceId,
      if (isInternetAvailable != null)
        'is_internet_available': isInternetAvailable,
      if (batteryPercentage != null) 'battery_percentage': batteryPercentage,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (callId != null) 'call_id': callId,
    });
  }

  DcrCheckInTableCompanion copyWith(
      {Value<int>? id,
      Value<String>? employeeId,
      Value<String>? customerId,
      Value<DateTime>? date,
      Value<DateTime>? checkInTime,
      Value<double>? latitude,
      Value<double>? longitude,
      Value<double>? accuracy,
      Value<double>? distance,
      Value<String?>? deviceId,
      Value<bool>? isInternetAvailable,
      Value<int?>? batteryPercentage,
      Value<int>? syncStatus,
      Value<String?>? callId}) {
    return DcrCheckInTableCompanion(
      id: id ?? this.id,
      employeeId: employeeId ?? this.employeeId,
      customerId: customerId ?? this.customerId,
      date: date ?? this.date,
      checkInTime: checkInTime ?? this.checkInTime,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      accuracy: accuracy ?? this.accuracy,
      distance: distance ?? this.distance,
      deviceId: deviceId ?? this.deviceId,
      isInternetAvailable: isInternetAvailable ?? this.isInternetAvailable,
      batteryPercentage: batteryPercentage ?? this.batteryPercentage,
      syncStatus: syncStatus ?? this.syncStatus,
      callId: callId ?? this.callId,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (employeeId.present) {
      map['employee_id'] = Variable<String>(employeeId.value);
    }
    if (customerId.present) {
      map['customer_id'] = Variable<String>(customerId.value);
    }
    if (date.present) {
      map['date'] = Variable<DateTime>(date.value);
    }
    if (checkInTime.present) {
      map['check_in_time'] = Variable<DateTime>(checkInTime.value);
    }
    if (latitude.present) {
      map['latitude'] = Variable<double>(latitude.value);
    }
    if (longitude.present) {
      map['longitude'] = Variable<double>(longitude.value);
    }
    if (accuracy.present) {
      map['accuracy'] = Variable<double>(accuracy.value);
    }
    if (distance.present) {
      map['distance'] = Variable<double>(distance.value);
    }
    if (deviceId.present) {
      map['device_id'] = Variable<String>(deviceId.value);
    }
    if (isInternetAvailable.present) {
      map['is_internet_available'] = Variable<bool>(isInternetAvailable.value);
    }
    if (batteryPercentage.present) {
      map['battery_percentage'] = Variable<int>(batteryPercentage.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (callId.present) {
      map['call_id'] = Variable<String>(callId.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DcrCheckInTableCompanion(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('customerId: $customerId, ')
          ..write('date: $date, ')
          ..write('checkInTime: $checkInTime, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('accuracy: $accuracy, ')
          ..write('distance: $distance, ')
          ..write('deviceId: $deviceId, ')
          ..write('isInternetAvailable: $isInternetAvailable, ')
          ..write('batteryPercentage: $batteryPercentage, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('callId: $callId')
          ..write(')'))
        .toString();
  }
}

class $DcrCheckOutTableTable extends DcrCheckOutTable
    with TableInfo<$DcrCheckOutTableTable, DcrCheckOutEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DcrCheckOutTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _checkInIdMeta =
      const VerificationMeta('checkInId');
  @override
  late final GeneratedColumn<String> checkInId = GeneratedColumn<String>(
      'check_in_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerIdMeta =
      const VerificationMeta('customerId');
  @override
  late final GeneratedColumn<String> customerId = GeneratedColumn<String>(
      'customer_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _checkInTimeMeta =
      const VerificationMeta('checkInTime');
  @override
  late final GeneratedColumn<DateTime> checkInTime = GeneratedColumn<DateTime>(
      'check_in_time', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _checkOutTimeMeta =
      const VerificationMeta('checkOutTime');
  @override
  late final GeneratedColumn<DateTime> checkOutTime = GeneratedColumn<DateTime>(
      'check_out_time', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _visitDurationMinutesMeta =
      const VerificationMeta('visitDurationMinutes');
  @override
  late final GeneratedColumn<int> visitDurationMinutes = GeneratedColumn<int>(
      'visit_duration_minutes', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _latitudeMeta =
      const VerificationMeta('latitude');
  @override
  late final GeneratedColumn<double> latitude = GeneratedColumn<double>(
      'latitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _longitudeMeta =
      const VerificationMeta('longitude');
  @override
  late final GeneratedColumn<double> longitude = GeneratedColumn<double>(
      'longitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _accuracyMeta =
      const VerificationMeta('accuracy');
  @override
  late final GeneratedColumn<double> accuracy = GeneratedColumn<double>(
      'accuracy', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _distanceMeta =
      const VerificationMeta('distance');
  @override
  late final GeneratedColumn<double> distance = GeneratedColumn<double>(
      'distance', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _callStatusMeta =
      const VerificationMeta('callStatus');
  @override
  late final GeneratedColumn<String> callStatus = GeneratedColumn<String>(
      'call_status', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _doctorMoodMeta =
      const VerificationMeta('doctorMood');
  @override
  late final GeneratedColumn<String> doctorMood = GeneratedColumn<String>(
      'doctor_mood', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _productInterestMeta =
      const VerificationMeta('productInterest');
  @override
  late final GeneratedColumn<String> productInterest = GeneratedColumn<String>(
      'product_interest', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _competitorActivityMeta =
      const VerificationMeta('competitorActivity');
  @override
  late final GeneratedColumn<String> competitorActivity =
      GeneratedColumn<String>('competitor_activity', aliasedName, true,
          type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _newOpportunityMeta =
      const VerificationMeta('newOpportunity');
  @override
  late final GeneratedColumn<String> newOpportunity = GeneratedColumn<String>(
      'new_opportunity', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _complaintMeta =
      const VerificationMeta('complaint');
  @override
  late final GeneratedColumn<String> complaint = GeneratedColumn<String>(
      'complaint', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _followUpRequiredMeta =
      const VerificationMeta('followUpRequired');
  @override
  late final GeneratedColumn<bool> followUpRequired = GeneratedColumn<bool>(
      'follow_up_required', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints: GeneratedColumn.constraintIsAlways(
          'CHECK ("follow_up_required" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _nextVisitNotesMeta =
      const VerificationMeta('nextVisitNotes');
  @override
  late final GeneratedColumn<String> nextVisitNotes = GeneratedColumn<String>(
      'next_visit_notes', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _remarksMeta =
      const VerificationMeta('remarks');
  @override
  late final GeneratedColumn<String> remarks = GeneratedColumn<String>(
      'remarks', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _isInternetAvailableMeta =
      const VerificationMeta('isInternetAvailable');
  @override
  late final GeneratedColumn<bool> isInternetAvailable = GeneratedColumn<bool>(
      'is_internet_available', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints: GeneratedColumn.constraintIsAlways(
          'CHECK ("is_internet_available" IN (0, 1))'),
      defaultValue: const Constant(true));
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns => [
        checkInId,
        customerId,
        checkInTime,
        checkOutTime,
        visitDurationMinutes,
        latitude,
        longitude,
        accuracy,
        distance,
        callStatus,
        doctorMood,
        productInterest,
        competitorActivity,
        newOpportunity,
        complaint,
        followUpRequired,
        nextVisitNotes,
        remarks,
        isInternetAvailable,
        syncStatus
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'dcr_check_out_table';
  @override
  VerificationContext validateIntegrity(Insertable<DcrCheckOutEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('check_in_id')) {
      context.handle(
          _checkInIdMeta,
          checkInId.isAcceptableOrUnknown(
              data['check_in_id']!, _checkInIdMeta));
    } else if (isInserting) {
      context.missing(_checkInIdMeta);
    }
    if (data.containsKey('customer_id')) {
      context.handle(
          _customerIdMeta,
          customerId.isAcceptableOrUnknown(
              data['customer_id']!, _customerIdMeta));
    } else if (isInserting) {
      context.missing(_customerIdMeta);
    }
    if (data.containsKey('check_in_time')) {
      context.handle(
          _checkInTimeMeta,
          checkInTime.isAcceptableOrUnknown(
              data['check_in_time']!, _checkInTimeMeta));
    } else if (isInserting) {
      context.missing(_checkInTimeMeta);
    }
    if (data.containsKey('check_out_time')) {
      context.handle(
          _checkOutTimeMeta,
          checkOutTime.isAcceptableOrUnknown(
              data['check_out_time']!, _checkOutTimeMeta));
    } else if (isInserting) {
      context.missing(_checkOutTimeMeta);
    }
    if (data.containsKey('visit_duration_minutes')) {
      context.handle(
          _visitDurationMinutesMeta,
          visitDurationMinutes.isAcceptableOrUnknown(
              data['visit_duration_minutes']!, _visitDurationMinutesMeta));
    } else if (isInserting) {
      context.missing(_visitDurationMinutesMeta);
    }
    if (data.containsKey('latitude')) {
      context.handle(_latitudeMeta,
          latitude.isAcceptableOrUnknown(data['latitude']!, _latitudeMeta));
    } else if (isInserting) {
      context.missing(_latitudeMeta);
    }
    if (data.containsKey('longitude')) {
      context.handle(_longitudeMeta,
          longitude.isAcceptableOrUnknown(data['longitude']!, _longitudeMeta));
    } else if (isInserting) {
      context.missing(_longitudeMeta);
    }
    if (data.containsKey('accuracy')) {
      context.handle(_accuracyMeta,
          accuracy.isAcceptableOrUnknown(data['accuracy']!, _accuracyMeta));
    } else if (isInserting) {
      context.missing(_accuracyMeta);
    }
    if (data.containsKey('distance')) {
      context.handle(_distanceMeta,
          distance.isAcceptableOrUnknown(data['distance']!, _distanceMeta));
    } else if (isInserting) {
      context.missing(_distanceMeta);
    }
    if (data.containsKey('call_status')) {
      context.handle(
          _callStatusMeta,
          callStatus.isAcceptableOrUnknown(
              data['call_status']!, _callStatusMeta));
    } else if (isInserting) {
      context.missing(_callStatusMeta);
    }
    if (data.containsKey('doctor_mood')) {
      context.handle(
          _doctorMoodMeta,
          doctorMood.isAcceptableOrUnknown(
              data['doctor_mood']!, _doctorMoodMeta));
    }
    if (data.containsKey('product_interest')) {
      context.handle(
          _productInterestMeta,
          productInterest.isAcceptableOrUnknown(
              data['product_interest']!, _productInterestMeta));
    }
    if (data.containsKey('competitor_activity')) {
      context.handle(
          _competitorActivityMeta,
          competitorActivity.isAcceptableOrUnknown(
              data['competitor_activity']!, _competitorActivityMeta));
    }
    if (data.containsKey('new_opportunity')) {
      context.handle(
          _newOpportunityMeta,
          newOpportunity.isAcceptableOrUnknown(
              data['new_opportunity']!, _newOpportunityMeta));
    }
    if (data.containsKey('complaint')) {
      context.handle(_complaintMeta,
          complaint.isAcceptableOrUnknown(data['complaint']!, _complaintMeta));
    }
    if (data.containsKey('follow_up_required')) {
      context.handle(
          _followUpRequiredMeta,
          followUpRequired.isAcceptableOrUnknown(
              data['follow_up_required']!, _followUpRequiredMeta));
    }
    if (data.containsKey('next_visit_notes')) {
      context.handle(
          _nextVisitNotesMeta,
          nextVisitNotes.isAcceptableOrUnknown(
              data['next_visit_notes']!, _nextVisitNotesMeta));
    }
    if (data.containsKey('remarks')) {
      context.handle(_remarksMeta,
          remarks.isAcceptableOrUnknown(data['remarks']!, _remarksMeta));
    }
    if (data.containsKey('is_internet_available')) {
      context.handle(
          _isInternetAvailableMeta,
          isInternetAvailable.isAcceptableOrUnknown(
              data['is_internet_available']!, _isInternetAvailableMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {checkInId};
  @override
  DcrCheckOutEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return DcrCheckOutEntry(
      checkInId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}check_in_id'])!,
      customerId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_id'])!,
      checkInTime: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}check_in_time'])!,
      checkOutTime: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}check_out_time'])!,
      visitDurationMinutes: attachedDatabase.typeMapping.read(
          DriftSqlType.int, data['${effectivePrefix}visit_duration_minutes'])!,
      latitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}latitude'])!,
      longitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}longitude'])!,
      accuracy: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}accuracy'])!,
      distance: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}distance'])!,
      callStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}call_status'])!,
      doctorMood: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}doctor_mood']),
      productInterest: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}product_interest']),
      competitorActivity: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}competitor_activity']),
      newOpportunity: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}new_opportunity']),
      complaint: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}complaint']),
      followUpRequired: attachedDatabase.typeMapping.read(
          DriftSqlType.bool, data['${effectivePrefix}follow_up_required'])!,
      nextVisitNotes: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}next_visit_notes']),
      remarks: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}remarks']),
      isInternetAvailable: attachedDatabase.typeMapping.read(
          DriftSqlType.bool, data['${effectivePrefix}is_internet_available'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $DcrCheckOutTableTable createAlias(String alias) {
    return $DcrCheckOutTableTable(attachedDatabase, alias);
  }
}

class DcrCheckOutEntry extends DataClass
    implements Insertable<DcrCheckOutEntry> {
  final String checkInId;
  final String customerId;
  final DateTime checkInTime;
  final DateTime checkOutTime;
  final int visitDurationMinutes;
  final double latitude;
  final double longitude;
  final double accuracy;
  final double distance;
  final String callStatus;
  final String? doctorMood;
  final String? productInterest;
  final String? competitorActivity;
  final String? newOpportunity;
  final String? complaint;
  final bool followUpRequired;
  final String? nextVisitNotes;
  final String? remarks;
  final bool isInternetAvailable;
  final int syncStatus;
  const DcrCheckOutEntry(
      {required this.checkInId,
      required this.customerId,
      required this.checkInTime,
      required this.checkOutTime,
      required this.visitDurationMinutes,
      required this.latitude,
      required this.longitude,
      required this.accuracy,
      required this.distance,
      required this.callStatus,
      this.doctorMood,
      this.productInterest,
      this.competitorActivity,
      this.newOpportunity,
      this.complaint,
      required this.followUpRequired,
      this.nextVisitNotes,
      this.remarks,
      required this.isInternetAvailable,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['check_in_id'] = Variable<String>(checkInId);
    map['customer_id'] = Variable<String>(customerId);
    map['check_in_time'] = Variable<DateTime>(checkInTime);
    map['check_out_time'] = Variable<DateTime>(checkOutTime);
    map['visit_duration_minutes'] = Variable<int>(visitDurationMinutes);
    map['latitude'] = Variable<double>(latitude);
    map['longitude'] = Variable<double>(longitude);
    map['accuracy'] = Variable<double>(accuracy);
    map['distance'] = Variable<double>(distance);
    map['call_status'] = Variable<String>(callStatus);
    if (!nullToAbsent || doctorMood != null) {
      map['doctor_mood'] = Variable<String>(doctorMood);
    }
    if (!nullToAbsent || productInterest != null) {
      map['product_interest'] = Variable<String>(productInterest);
    }
    if (!nullToAbsent || competitorActivity != null) {
      map['competitor_activity'] = Variable<String>(competitorActivity);
    }
    if (!nullToAbsent || newOpportunity != null) {
      map['new_opportunity'] = Variable<String>(newOpportunity);
    }
    if (!nullToAbsent || complaint != null) {
      map['complaint'] = Variable<String>(complaint);
    }
    map['follow_up_required'] = Variable<bool>(followUpRequired);
    if (!nullToAbsent || nextVisitNotes != null) {
      map['next_visit_notes'] = Variable<String>(nextVisitNotes);
    }
    if (!nullToAbsent || remarks != null) {
      map['remarks'] = Variable<String>(remarks);
    }
    map['is_internet_available'] = Variable<bool>(isInternetAvailable);
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  DcrCheckOutTableCompanion toCompanion(bool nullToAbsent) {
    return DcrCheckOutTableCompanion(
      checkInId: Value(checkInId),
      customerId: Value(customerId),
      checkInTime: Value(checkInTime),
      checkOutTime: Value(checkOutTime),
      visitDurationMinutes: Value(visitDurationMinutes),
      latitude: Value(latitude),
      longitude: Value(longitude),
      accuracy: Value(accuracy),
      distance: Value(distance),
      callStatus: Value(callStatus),
      doctorMood: doctorMood == null && nullToAbsent
          ? const Value.absent()
          : Value(doctorMood),
      productInterest: productInterest == null && nullToAbsent
          ? const Value.absent()
          : Value(productInterest),
      competitorActivity: competitorActivity == null && nullToAbsent
          ? const Value.absent()
          : Value(competitorActivity),
      newOpportunity: newOpportunity == null && nullToAbsent
          ? const Value.absent()
          : Value(newOpportunity),
      complaint: complaint == null && nullToAbsent
          ? const Value.absent()
          : Value(complaint),
      followUpRequired: Value(followUpRequired),
      nextVisitNotes: nextVisitNotes == null && nullToAbsent
          ? const Value.absent()
          : Value(nextVisitNotes),
      remarks: remarks == null && nullToAbsent
          ? const Value.absent()
          : Value(remarks),
      isInternetAvailable: Value(isInternetAvailable),
      syncStatus: Value(syncStatus),
    );
  }

  factory DcrCheckOutEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return DcrCheckOutEntry(
      checkInId: serializer.fromJson<String>(json['checkInId']),
      customerId: serializer.fromJson<String>(json['customerId']),
      checkInTime: serializer.fromJson<DateTime>(json['checkInTime']),
      checkOutTime: serializer.fromJson<DateTime>(json['checkOutTime']),
      visitDurationMinutes:
          serializer.fromJson<int>(json['visitDurationMinutes']),
      latitude: serializer.fromJson<double>(json['latitude']),
      longitude: serializer.fromJson<double>(json['longitude']),
      accuracy: serializer.fromJson<double>(json['accuracy']),
      distance: serializer.fromJson<double>(json['distance']),
      callStatus: serializer.fromJson<String>(json['callStatus']),
      doctorMood: serializer.fromJson<String?>(json['doctorMood']),
      productInterest: serializer.fromJson<String?>(json['productInterest']),
      competitorActivity:
          serializer.fromJson<String?>(json['competitorActivity']),
      newOpportunity: serializer.fromJson<String?>(json['newOpportunity']),
      complaint: serializer.fromJson<String?>(json['complaint']),
      followUpRequired: serializer.fromJson<bool>(json['followUpRequired']),
      nextVisitNotes: serializer.fromJson<String?>(json['nextVisitNotes']),
      remarks: serializer.fromJson<String?>(json['remarks']),
      isInternetAvailable:
          serializer.fromJson<bool>(json['isInternetAvailable']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'checkInId': serializer.toJson<String>(checkInId),
      'customerId': serializer.toJson<String>(customerId),
      'checkInTime': serializer.toJson<DateTime>(checkInTime),
      'checkOutTime': serializer.toJson<DateTime>(checkOutTime),
      'visitDurationMinutes': serializer.toJson<int>(visitDurationMinutes),
      'latitude': serializer.toJson<double>(latitude),
      'longitude': serializer.toJson<double>(longitude),
      'accuracy': serializer.toJson<double>(accuracy),
      'distance': serializer.toJson<double>(distance),
      'callStatus': serializer.toJson<String>(callStatus),
      'doctorMood': serializer.toJson<String?>(doctorMood),
      'productInterest': serializer.toJson<String?>(productInterest),
      'competitorActivity': serializer.toJson<String?>(competitorActivity),
      'newOpportunity': serializer.toJson<String?>(newOpportunity),
      'complaint': serializer.toJson<String?>(complaint),
      'followUpRequired': serializer.toJson<bool>(followUpRequired),
      'nextVisitNotes': serializer.toJson<String?>(nextVisitNotes),
      'remarks': serializer.toJson<String?>(remarks),
      'isInternetAvailable': serializer.toJson<bool>(isInternetAvailable),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  DcrCheckOutEntry copyWith(
          {String? checkInId,
          String? customerId,
          DateTime? checkInTime,
          DateTime? checkOutTime,
          int? visitDurationMinutes,
          double? latitude,
          double? longitude,
          double? accuracy,
          double? distance,
          String? callStatus,
          Value<String?> doctorMood = const Value.absent(),
          Value<String?> productInterest = const Value.absent(),
          Value<String?> competitorActivity = const Value.absent(),
          Value<String?> newOpportunity = const Value.absent(),
          Value<String?> complaint = const Value.absent(),
          bool? followUpRequired,
          Value<String?> nextVisitNotes = const Value.absent(),
          Value<String?> remarks = const Value.absent(),
          bool? isInternetAvailable,
          int? syncStatus}) =>
      DcrCheckOutEntry(
        checkInId: checkInId ?? this.checkInId,
        customerId: customerId ?? this.customerId,
        checkInTime: checkInTime ?? this.checkInTime,
        checkOutTime: checkOutTime ?? this.checkOutTime,
        visitDurationMinutes: visitDurationMinutes ?? this.visitDurationMinutes,
        latitude: latitude ?? this.latitude,
        longitude: longitude ?? this.longitude,
        accuracy: accuracy ?? this.accuracy,
        distance: distance ?? this.distance,
        callStatus: callStatus ?? this.callStatus,
        doctorMood: doctorMood.present ? doctorMood.value : this.doctorMood,
        productInterest: productInterest.present
            ? productInterest.value
            : this.productInterest,
        competitorActivity: competitorActivity.present
            ? competitorActivity.value
            : this.competitorActivity,
        newOpportunity:
            newOpportunity.present ? newOpportunity.value : this.newOpportunity,
        complaint: complaint.present ? complaint.value : this.complaint,
        followUpRequired: followUpRequired ?? this.followUpRequired,
        nextVisitNotes:
            nextVisitNotes.present ? nextVisitNotes.value : this.nextVisitNotes,
        remarks: remarks.present ? remarks.value : this.remarks,
        isInternetAvailable: isInternetAvailable ?? this.isInternetAvailable,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  DcrCheckOutEntry copyWithCompanion(DcrCheckOutTableCompanion data) {
    return DcrCheckOutEntry(
      checkInId: data.checkInId.present ? data.checkInId.value : this.checkInId,
      customerId:
          data.customerId.present ? data.customerId.value : this.customerId,
      checkInTime:
          data.checkInTime.present ? data.checkInTime.value : this.checkInTime,
      checkOutTime: data.checkOutTime.present
          ? data.checkOutTime.value
          : this.checkOutTime,
      visitDurationMinutes: data.visitDurationMinutes.present
          ? data.visitDurationMinutes.value
          : this.visitDurationMinutes,
      latitude: data.latitude.present ? data.latitude.value : this.latitude,
      longitude: data.longitude.present ? data.longitude.value : this.longitude,
      accuracy: data.accuracy.present ? data.accuracy.value : this.accuracy,
      distance: data.distance.present ? data.distance.value : this.distance,
      callStatus:
          data.callStatus.present ? data.callStatus.value : this.callStatus,
      doctorMood:
          data.doctorMood.present ? data.doctorMood.value : this.doctorMood,
      productInterest: data.productInterest.present
          ? data.productInterest.value
          : this.productInterest,
      competitorActivity: data.competitorActivity.present
          ? data.competitorActivity.value
          : this.competitorActivity,
      newOpportunity: data.newOpportunity.present
          ? data.newOpportunity.value
          : this.newOpportunity,
      complaint: data.complaint.present ? data.complaint.value : this.complaint,
      followUpRequired: data.followUpRequired.present
          ? data.followUpRequired.value
          : this.followUpRequired,
      nextVisitNotes: data.nextVisitNotes.present
          ? data.nextVisitNotes.value
          : this.nextVisitNotes,
      remarks: data.remarks.present ? data.remarks.value : this.remarks,
      isInternetAvailable: data.isInternetAvailable.present
          ? data.isInternetAvailable.value
          : this.isInternetAvailable,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('DcrCheckOutEntry(')
          ..write('checkInId: $checkInId, ')
          ..write('customerId: $customerId, ')
          ..write('checkInTime: $checkInTime, ')
          ..write('checkOutTime: $checkOutTime, ')
          ..write('visitDurationMinutes: $visitDurationMinutes, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('accuracy: $accuracy, ')
          ..write('distance: $distance, ')
          ..write('callStatus: $callStatus, ')
          ..write('doctorMood: $doctorMood, ')
          ..write('productInterest: $productInterest, ')
          ..write('competitorActivity: $competitorActivity, ')
          ..write('newOpportunity: $newOpportunity, ')
          ..write('complaint: $complaint, ')
          ..write('followUpRequired: $followUpRequired, ')
          ..write('nextVisitNotes: $nextVisitNotes, ')
          ..write('remarks: $remarks, ')
          ..write('isInternetAvailable: $isInternetAvailable, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      checkInId,
      customerId,
      checkInTime,
      checkOutTime,
      visitDurationMinutes,
      latitude,
      longitude,
      accuracy,
      distance,
      callStatus,
      doctorMood,
      productInterest,
      competitorActivity,
      newOpportunity,
      complaint,
      followUpRequired,
      nextVisitNotes,
      remarks,
      isInternetAvailable,
      syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is DcrCheckOutEntry &&
          other.checkInId == this.checkInId &&
          other.customerId == this.customerId &&
          other.checkInTime == this.checkInTime &&
          other.checkOutTime == this.checkOutTime &&
          other.visitDurationMinutes == this.visitDurationMinutes &&
          other.latitude == this.latitude &&
          other.longitude == this.longitude &&
          other.accuracy == this.accuracy &&
          other.distance == this.distance &&
          other.callStatus == this.callStatus &&
          other.doctorMood == this.doctorMood &&
          other.productInterest == this.productInterest &&
          other.competitorActivity == this.competitorActivity &&
          other.newOpportunity == this.newOpportunity &&
          other.complaint == this.complaint &&
          other.followUpRequired == this.followUpRequired &&
          other.nextVisitNotes == this.nextVisitNotes &&
          other.remarks == this.remarks &&
          other.isInternetAvailable == this.isInternetAvailable &&
          other.syncStatus == this.syncStatus);
}

class DcrCheckOutTableCompanion extends UpdateCompanion<DcrCheckOutEntry> {
  final Value<String> checkInId;
  final Value<String> customerId;
  final Value<DateTime> checkInTime;
  final Value<DateTime> checkOutTime;
  final Value<int> visitDurationMinutes;
  final Value<double> latitude;
  final Value<double> longitude;
  final Value<double> accuracy;
  final Value<double> distance;
  final Value<String> callStatus;
  final Value<String?> doctorMood;
  final Value<String?> productInterest;
  final Value<String?> competitorActivity;
  final Value<String?> newOpportunity;
  final Value<String?> complaint;
  final Value<bool> followUpRequired;
  final Value<String?> nextVisitNotes;
  final Value<String?> remarks;
  final Value<bool> isInternetAvailable;
  final Value<int> syncStatus;
  final Value<int> rowid;
  const DcrCheckOutTableCompanion({
    this.checkInId = const Value.absent(),
    this.customerId = const Value.absent(),
    this.checkInTime = const Value.absent(),
    this.checkOutTime = const Value.absent(),
    this.visitDurationMinutes = const Value.absent(),
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.accuracy = const Value.absent(),
    this.distance = const Value.absent(),
    this.callStatus = const Value.absent(),
    this.doctorMood = const Value.absent(),
    this.productInterest = const Value.absent(),
    this.competitorActivity = const Value.absent(),
    this.newOpportunity = const Value.absent(),
    this.complaint = const Value.absent(),
    this.followUpRequired = const Value.absent(),
    this.nextVisitNotes = const Value.absent(),
    this.remarks = const Value.absent(),
    this.isInternetAvailable = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  DcrCheckOutTableCompanion.insert({
    required String checkInId,
    required String customerId,
    required DateTime checkInTime,
    required DateTime checkOutTime,
    required int visitDurationMinutes,
    required double latitude,
    required double longitude,
    required double accuracy,
    required double distance,
    required String callStatus,
    this.doctorMood = const Value.absent(),
    this.productInterest = const Value.absent(),
    this.competitorActivity = const Value.absent(),
    this.newOpportunity = const Value.absent(),
    this.complaint = const Value.absent(),
    this.followUpRequired = const Value.absent(),
    this.nextVisitNotes = const Value.absent(),
    this.remarks = const Value.absent(),
    this.isInternetAvailable = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : checkInId = Value(checkInId),
        customerId = Value(customerId),
        checkInTime = Value(checkInTime),
        checkOutTime = Value(checkOutTime),
        visitDurationMinutes = Value(visitDurationMinutes),
        latitude = Value(latitude),
        longitude = Value(longitude),
        accuracy = Value(accuracy),
        distance = Value(distance),
        callStatus = Value(callStatus);
  static Insertable<DcrCheckOutEntry> custom({
    Expression<String>? checkInId,
    Expression<String>? customerId,
    Expression<DateTime>? checkInTime,
    Expression<DateTime>? checkOutTime,
    Expression<int>? visitDurationMinutes,
    Expression<double>? latitude,
    Expression<double>? longitude,
    Expression<double>? accuracy,
    Expression<double>? distance,
    Expression<String>? callStatus,
    Expression<String>? doctorMood,
    Expression<String>? productInterest,
    Expression<String>? competitorActivity,
    Expression<String>? newOpportunity,
    Expression<String>? complaint,
    Expression<bool>? followUpRequired,
    Expression<String>? nextVisitNotes,
    Expression<String>? remarks,
    Expression<bool>? isInternetAvailable,
    Expression<int>? syncStatus,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (checkInId != null) 'check_in_id': checkInId,
      if (customerId != null) 'customer_id': customerId,
      if (checkInTime != null) 'check_in_time': checkInTime,
      if (checkOutTime != null) 'check_out_time': checkOutTime,
      if (visitDurationMinutes != null)
        'visit_duration_minutes': visitDurationMinutes,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (accuracy != null) 'accuracy': accuracy,
      if (distance != null) 'distance': distance,
      if (callStatus != null) 'call_status': callStatus,
      if (doctorMood != null) 'doctor_mood': doctorMood,
      if (productInterest != null) 'product_interest': productInterest,
      if (competitorActivity != null) 'competitor_activity': competitorActivity,
      if (newOpportunity != null) 'new_opportunity': newOpportunity,
      if (complaint != null) 'complaint': complaint,
      if (followUpRequired != null) 'follow_up_required': followUpRequired,
      if (nextVisitNotes != null) 'next_visit_notes': nextVisitNotes,
      if (remarks != null) 'remarks': remarks,
      if (isInternetAvailable != null)
        'is_internet_available': isInternetAvailable,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (rowid != null) 'rowid': rowid,
    });
  }

  DcrCheckOutTableCompanion copyWith(
      {Value<String>? checkInId,
      Value<String>? customerId,
      Value<DateTime>? checkInTime,
      Value<DateTime>? checkOutTime,
      Value<int>? visitDurationMinutes,
      Value<double>? latitude,
      Value<double>? longitude,
      Value<double>? accuracy,
      Value<double>? distance,
      Value<String>? callStatus,
      Value<String?>? doctorMood,
      Value<String?>? productInterest,
      Value<String?>? competitorActivity,
      Value<String?>? newOpportunity,
      Value<String?>? complaint,
      Value<bool>? followUpRequired,
      Value<String?>? nextVisitNotes,
      Value<String?>? remarks,
      Value<bool>? isInternetAvailable,
      Value<int>? syncStatus,
      Value<int>? rowid}) {
    return DcrCheckOutTableCompanion(
      checkInId: checkInId ?? this.checkInId,
      customerId: customerId ?? this.customerId,
      checkInTime: checkInTime ?? this.checkInTime,
      checkOutTime: checkOutTime ?? this.checkOutTime,
      visitDurationMinutes: visitDurationMinutes ?? this.visitDurationMinutes,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      accuracy: accuracy ?? this.accuracy,
      distance: distance ?? this.distance,
      callStatus: callStatus ?? this.callStatus,
      doctorMood: doctorMood ?? this.doctorMood,
      productInterest: productInterest ?? this.productInterest,
      competitorActivity: competitorActivity ?? this.competitorActivity,
      newOpportunity: newOpportunity ?? this.newOpportunity,
      complaint: complaint ?? this.complaint,
      followUpRequired: followUpRequired ?? this.followUpRequired,
      nextVisitNotes: nextVisitNotes ?? this.nextVisitNotes,
      remarks: remarks ?? this.remarks,
      isInternetAvailable: isInternetAvailable ?? this.isInternetAvailable,
      syncStatus: syncStatus ?? this.syncStatus,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (checkInId.present) {
      map['check_in_id'] = Variable<String>(checkInId.value);
    }
    if (customerId.present) {
      map['customer_id'] = Variable<String>(customerId.value);
    }
    if (checkInTime.present) {
      map['check_in_time'] = Variable<DateTime>(checkInTime.value);
    }
    if (checkOutTime.present) {
      map['check_out_time'] = Variable<DateTime>(checkOutTime.value);
    }
    if (visitDurationMinutes.present) {
      map['visit_duration_minutes'] = Variable<int>(visitDurationMinutes.value);
    }
    if (latitude.present) {
      map['latitude'] = Variable<double>(latitude.value);
    }
    if (longitude.present) {
      map['longitude'] = Variable<double>(longitude.value);
    }
    if (accuracy.present) {
      map['accuracy'] = Variable<double>(accuracy.value);
    }
    if (distance.present) {
      map['distance'] = Variable<double>(distance.value);
    }
    if (callStatus.present) {
      map['call_status'] = Variable<String>(callStatus.value);
    }
    if (doctorMood.present) {
      map['doctor_mood'] = Variable<String>(doctorMood.value);
    }
    if (productInterest.present) {
      map['product_interest'] = Variable<String>(productInterest.value);
    }
    if (competitorActivity.present) {
      map['competitor_activity'] = Variable<String>(competitorActivity.value);
    }
    if (newOpportunity.present) {
      map['new_opportunity'] = Variable<String>(newOpportunity.value);
    }
    if (complaint.present) {
      map['complaint'] = Variable<String>(complaint.value);
    }
    if (followUpRequired.present) {
      map['follow_up_required'] = Variable<bool>(followUpRequired.value);
    }
    if (nextVisitNotes.present) {
      map['next_visit_notes'] = Variable<String>(nextVisitNotes.value);
    }
    if (remarks.present) {
      map['remarks'] = Variable<String>(remarks.value);
    }
    if (isInternetAvailable.present) {
      map['is_internet_available'] = Variable<bool>(isInternetAvailable.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DcrCheckOutTableCompanion(')
          ..write('checkInId: $checkInId, ')
          ..write('customerId: $customerId, ')
          ..write('checkInTime: $checkInTime, ')
          ..write('checkOutTime: $checkOutTime, ')
          ..write('visitDurationMinutes: $visitDurationMinutes, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('accuracy: $accuracy, ')
          ..write('distance: $distance, ')
          ..write('callStatus: $callStatus, ')
          ..write('doctorMood: $doctorMood, ')
          ..write('productInterest: $productInterest, ')
          ..write('competitorActivity: $competitorActivity, ')
          ..write('newOpportunity: $newOpportunity, ')
          ..write('complaint: $complaint, ')
          ..write('followUpRequired: $followUpRequired, ')
          ..write('nextVisitNotes: $nextVisitNotes, ')
          ..write('remarks: $remarks, ')
          ..write('isInternetAvailable: $isInternetAvailable, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $DcrReportTableTable extends DcrReportTable
    with TableInfo<$DcrReportTableTable, DcrReportEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DcrReportTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _checkInIdMeta =
      const VerificationMeta('checkInId');
  @override
  late final GeneratedColumn<String> checkInId = GeneratedColumn<String>(
      'check_in_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerIdMeta =
      const VerificationMeta('customerId');
  @override
  late final GeneratedColumn<String> customerId = GeneratedColumn<String>(
      'customer_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _samplingDataMeta =
      const VerificationMeta('samplingData');
  @override
  late final GeneratedColumn<String> samplingData = GeneratedColumn<String>(
      'sampling_data', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _prescriptionDataMeta =
      const VerificationMeta('prescriptionData');
  @override
  late final GeneratedColumn<String> prescriptionData = GeneratedColumn<String>(
      'prescription_data', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _orderDataMeta =
      const VerificationMeta('orderData');
  @override
  late final GeneratedColumn<String> orderData = GeneratedColumn<String>(
      'order_data', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _summaryDataMeta =
      const VerificationMeta('summaryData');
  @override
  late final GeneratedColumn<String> summaryData = GeneratedColumn<String>(
      'summary_data', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _isDraftMeta =
      const VerificationMeta('isDraft');
  @override
  late final GeneratedColumn<bool> isDraft = GeneratedColumn<bool>(
      'is_draft', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('CHECK ("is_draft" IN (0, 1))'),
      defaultValue: const Constant(true));
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns => [
        checkInId,
        customerId,
        samplingData,
        prescriptionData,
        orderData,
        summaryData,
        isDraft,
        syncStatus
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'dcr_report_table';
  @override
  VerificationContext validateIntegrity(Insertable<DcrReportEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('check_in_id')) {
      context.handle(
          _checkInIdMeta,
          checkInId.isAcceptableOrUnknown(
              data['check_in_id']!, _checkInIdMeta));
    } else if (isInserting) {
      context.missing(_checkInIdMeta);
    }
    if (data.containsKey('customer_id')) {
      context.handle(
          _customerIdMeta,
          customerId.isAcceptableOrUnknown(
              data['customer_id']!, _customerIdMeta));
    } else if (isInserting) {
      context.missing(_customerIdMeta);
    }
    if (data.containsKey('sampling_data')) {
      context.handle(
          _samplingDataMeta,
          samplingData.isAcceptableOrUnknown(
              data['sampling_data']!, _samplingDataMeta));
    }
    if (data.containsKey('prescription_data')) {
      context.handle(
          _prescriptionDataMeta,
          prescriptionData.isAcceptableOrUnknown(
              data['prescription_data']!, _prescriptionDataMeta));
    }
    if (data.containsKey('order_data')) {
      context.handle(_orderDataMeta,
          orderData.isAcceptableOrUnknown(data['order_data']!, _orderDataMeta));
    }
    if (data.containsKey('summary_data')) {
      context.handle(
          _summaryDataMeta,
          summaryData.isAcceptableOrUnknown(
              data['summary_data']!, _summaryDataMeta));
    }
    if (data.containsKey('is_draft')) {
      context.handle(_isDraftMeta,
          isDraft.isAcceptableOrUnknown(data['is_draft']!, _isDraftMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {checkInId};
  @override
  DcrReportEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return DcrReportEntry(
      checkInId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}check_in_id'])!,
      customerId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_id'])!,
      samplingData: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}sampling_data']),
      prescriptionData: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}prescription_data']),
      orderData: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}order_data']),
      summaryData: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}summary_data']),
      isDraft: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_draft'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $DcrReportTableTable createAlias(String alias) {
    return $DcrReportTableTable(attachedDatabase, alias);
  }
}

class DcrReportEntry extends DataClass implements Insertable<DcrReportEntry> {
  final String checkInId;
  final String customerId;
  final String? samplingData;
  final String? prescriptionData;
  final String? orderData;
  final String? summaryData;
  final bool isDraft;
  final int syncStatus;
  const DcrReportEntry(
      {required this.checkInId,
      required this.customerId,
      this.samplingData,
      this.prescriptionData,
      this.orderData,
      this.summaryData,
      required this.isDraft,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['check_in_id'] = Variable<String>(checkInId);
    map['customer_id'] = Variable<String>(customerId);
    if (!nullToAbsent || samplingData != null) {
      map['sampling_data'] = Variable<String>(samplingData);
    }
    if (!nullToAbsent || prescriptionData != null) {
      map['prescription_data'] = Variable<String>(prescriptionData);
    }
    if (!nullToAbsent || orderData != null) {
      map['order_data'] = Variable<String>(orderData);
    }
    if (!nullToAbsent || summaryData != null) {
      map['summary_data'] = Variable<String>(summaryData);
    }
    map['is_draft'] = Variable<bool>(isDraft);
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  DcrReportTableCompanion toCompanion(bool nullToAbsent) {
    return DcrReportTableCompanion(
      checkInId: Value(checkInId),
      customerId: Value(customerId),
      samplingData: samplingData == null && nullToAbsent
          ? const Value.absent()
          : Value(samplingData),
      prescriptionData: prescriptionData == null && nullToAbsent
          ? const Value.absent()
          : Value(prescriptionData),
      orderData: orderData == null && nullToAbsent
          ? const Value.absent()
          : Value(orderData),
      summaryData: summaryData == null && nullToAbsent
          ? const Value.absent()
          : Value(summaryData),
      isDraft: Value(isDraft),
      syncStatus: Value(syncStatus),
    );
  }

  factory DcrReportEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return DcrReportEntry(
      checkInId: serializer.fromJson<String>(json['checkInId']),
      customerId: serializer.fromJson<String>(json['customerId']),
      samplingData: serializer.fromJson<String?>(json['samplingData']),
      prescriptionData: serializer.fromJson<String?>(json['prescriptionData']),
      orderData: serializer.fromJson<String?>(json['orderData']),
      summaryData: serializer.fromJson<String?>(json['summaryData']),
      isDraft: serializer.fromJson<bool>(json['isDraft']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'checkInId': serializer.toJson<String>(checkInId),
      'customerId': serializer.toJson<String>(customerId),
      'samplingData': serializer.toJson<String?>(samplingData),
      'prescriptionData': serializer.toJson<String?>(prescriptionData),
      'orderData': serializer.toJson<String?>(orderData),
      'summaryData': serializer.toJson<String?>(summaryData),
      'isDraft': serializer.toJson<bool>(isDraft),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  DcrReportEntry copyWith(
          {String? checkInId,
          String? customerId,
          Value<String?> samplingData = const Value.absent(),
          Value<String?> prescriptionData = const Value.absent(),
          Value<String?> orderData = const Value.absent(),
          Value<String?> summaryData = const Value.absent(),
          bool? isDraft,
          int? syncStatus}) =>
      DcrReportEntry(
        checkInId: checkInId ?? this.checkInId,
        customerId: customerId ?? this.customerId,
        samplingData:
            samplingData.present ? samplingData.value : this.samplingData,
        prescriptionData: prescriptionData.present
            ? prescriptionData.value
            : this.prescriptionData,
        orderData: orderData.present ? orderData.value : this.orderData,
        summaryData: summaryData.present ? summaryData.value : this.summaryData,
        isDraft: isDraft ?? this.isDraft,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  DcrReportEntry copyWithCompanion(DcrReportTableCompanion data) {
    return DcrReportEntry(
      checkInId: data.checkInId.present ? data.checkInId.value : this.checkInId,
      customerId:
          data.customerId.present ? data.customerId.value : this.customerId,
      samplingData: data.samplingData.present
          ? data.samplingData.value
          : this.samplingData,
      prescriptionData: data.prescriptionData.present
          ? data.prescriptionData.value
          : this.prescriptionData,
      orderData: data.orderData.present ? data.orderData.value : this.orderData,
      summaryData:
          data.summaryData.present ? data.summaryData.value : this.summaryData,
      isDraft: data.isDraft.present ? data.isDraft.value : this.isDraft,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('DcrReportEntry(')
          ..write('checkInId: $checkInId, ')
          ..write('customerId: $customerId, ')
          ..write('samplingData: $samplingData, ')
          ..write('prescriptionData: $prescriptionData, ')
          ..write('orderData: $orderData, ')
          ..write('summaryData: $summaryData, ')
          ..write('isDraft: $isDraft, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(checkInId, customerId, samplingData,
      prescriptionData, orderData, summaryData, isDraft, syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is DcrReportEntry &&
          other.checkInId == this.checkInId &&
          other.customerId == this.customerId &&
          other.samplingData == this.samplingData &&
          other.prescriptionData == this.prescriptionData &&
          other.orderData == this.orderData &&
          other.summaryData == this.summaryData &&
          other.isDraft == this.isDraft &&
          other.syncStatus == this.syncStatus);
}

class DcrReportTableCompanion extends UpdateCompanion<DcrReportEntry> {
  final Value<String> checkInId;
  final Value<String> customerId;
  final Value<String?> samplingData;
  final Value<String?> prescriptionData;
  final Value<String?> orderData;
  final Value<String?> summaryData;
  final Value<bool> isDraft;
  final Value<int> syncStatus;
  final Value<int> rowid;
  const DcrReportTableCompanion({
    this.checkInId = const Value.absent(),
    this.customerId = const Value.absent(),
    this.samplingData = const Value.absent(),
    this.prescriptionData = const Value.absent(),
    this.orderData = const Value.absent(),
    this.summaryData = const Value.absent(),
    this.isDraft = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  DcrReportTableCompanion.insert({
    required String checkInId,
    required String customerId,
    this.samplingData = const Value.absent(),
    this.prescriptionData = const Value.absent(),
    this.orderData = const Value.absent(),
    this.summaryData = const Value.absent(),
    this.isDraft = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : checkInId = Value(checkInId),
        customerId = Value(customerId);
  static Insertable<DcrReportEntry> custom({
    Expression<String>? checkInId,
    Expression<String>? customerId,
    Expression<String>? samplingData,
    Expression<String>? prescriptionData,
    Expression<String>? orderData,
    Expression<String>? summaryData,
    Expression<bool>? isDraft,
    Expression<int>? syncStatus,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (checkInId != null) 'check_in_id': checkInId,
      if (customerId != null) 'customer_id': customerId,
      if (samplingData != null) 'sampling_data': samplingData,
      if (prescriptionData != null) 'prescription_data': prescriptionData,
      if (orderData != null) 'order_data': orderData,
      if (summaryData != null) 'summary_data': summaryData,
      if (isDraft != null) 'is_draft': isDraft,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (rowid != null) 'rowid': rowid,
    });
  }

  DcrReportTableCompanion copyWith(
      {Value<String>? checkInId,
      Value<String>? customerId,
      Value<String?>? samplingData,
      Value<String?>? prescriptionData,
      Value<String?>? orderData,
      Value<String?>? summaryData,
      Value<bool>? isDraft,
      Value<int>? syncStatus,
      Value<int>? rowid}) {
    return DcrReportTableCompanion(
      checkInId: checkInId ?? this.checkInId,
      customerId: customerId ?? this.customerId,
      samplingData: samplingData ?? this.samplingData,
      prescriptionData: prescriptionData ?? this.prescriptionData,
      orderData: orderData ?? this.orderData,
      summaryData: summaryData ?? this.summaryData,
      isDraft: isDraft ?? this.isDraft,
      syncStatus: syncStatus ?? this.syncStatus,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (checkInId.present) {
      map['check_in_id'] = Variable<String>(checkInId.value);
    }
    if (customerId.present) {
      map['customer_id'] = Variable<String>(customerId.value);
    }
    if (samplingData.present) {
      map['sampling_data'] = Variable<String>(samplingData.value);
    }
    if (prescriptionData.present) {
      map['prescription_data'] = Variable<String>(prescriptionData.value);
    }
    if (orderData.present) {
      map['order_data'] = Variable<String>(orderData.value);
    }
    if (summaryData.present) {
      map['summary_data'] = Variable<String>(summaryData.value);
    }
    if (isDraft.present) {
      map['is_draft'] = Variable<bool>(isDraft.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DcrReportTableCompanion(')
          ..write('checkInId: $checkInId, ')
          ..write('customerId: $customerId, ')
          ..write('samplingData: $samplingData, ')
          ..write('prescriptionData: $prescriptionData, ')
          ..write('orderData: $orderData, ')
          ..write('summaryData: $summaryData, ')
          ..write('isDraft: $isDraft, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $DcrSubmissionTableTable extends DcrSubmissionTable
    with TableInfo<$DcrSubmissionTableTable, DcrSubmissionEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DcrSubmissionTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _dcrIdMeta = const VerificationMeta('dcrId');
  @override
  late final GeneratedColumn<String> dcrId = GeneratedColumn<String>(
      'dcr_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _checkInIdMeta =
      const VerificationMeta('checkInId');
  @override
  late final GeneratedColumn<String> checkInId = GeneratedColumn<String>(
      'check_in_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerIdMeta =
      const VerificationMeta('customerId');
  @override
  late final GeneratedColumn<String> customerId = GeneratedColumn<String>(
      'customer_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _submissionTimeMeta =
      const VerificationMeta('submissionTime');
  @override
  late final GeneratedColumn<DateTime> submissionTime =
      GeneratedColumn<DateTime>('submission_time', aliasedName, false,
          type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _isJointWorkMeta =
      const VerificationMeta('isJointWork');
  @override
  late final GeneratedColumn<bool> isJointWork = GeneratedColumn<bool>(
      'is_joint_work', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints: GeneratedColumn.constraintIsAlways(
          'CHECK ("is_joint_work" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _taggedManagersMeta =
      const VerificationMeta('taggedManagers');
  @override
  late final GeneratedColumn<String> taggedManagers = GeneratedColumn<String>(
      'tagged_managers', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _isLockedMeta =
      const VerificationMeta('isLocked');
  @override
  late final GeneratedColumn<bool> isLocked = GeneratedColumn<bool>(
      'is_locked', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('CHECK ("is_locked" IN (0, 1))'),
      defaultValue: const Constant(true));
  static const VerificationMeta _createdByMeta =
      const VerificationMeta('createdBy');
  @override
  late final GeneratedColumn<String> createdBy = GeneratedColumn<String>(
      'created_by', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _deviceIdMeta =
      const VerificationMeta('deviceId');
  @override
  late final GeneratedColumn<String> deviceId = GeneratedColumn<String>(
      'device_id', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _appVersionMeta =
      const VerificationMeta('appVersion');
  @override
  late final GeneratedColumn<String> appVersion = GeneratedColumn<String>(
      'app_version', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _latitudeMeta =
      const VerificationMeta('latitude');
  @override
  late final GeneratedColumn<double> latitude = GeneratedColumn<double>(
      'latitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _longitudeMeta =
      const VerificationMeta('longitude');
  @override
  late final GeneratedColumn<double> longitude = GeneratedColumn<double>(
      'longitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns => [
        dcrId,
        checkInId,
        customerId,
        submissionTime,
        isJointWork,
        taggedManagers,
        isLocked,
        createdBy,
        deviceId,
        appVersion,
        latitude,
        longitude,
        syncStatus
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'dcr_submission_table';
  @override
  VerificationContext validateIntegrity(Insertable<DcrSubmissionEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('dcr_id')) {
      context.handle(
          _dcrIdMeta, dcrId.isAcceptableOrUnknown(data['dcr_id']!, _dcrIdMeta));
    } else if (isInserting) {
      context.missing(_dcrIdMeta);
    }
    if (data.containsKey('check_in_id')) {
      context.handle(
          _checkInIdMeta,
          checkInId.isAcceptableOrUnknown(
              data['check_in_id']!, _checkInIdMeta));
    } else if (isInserting) {
      context.missing(_checkInIdMeta);
    }
    if (data.containsKey('customer_id')) {
      context.handle(
          _customerIdMeta,
          customerId.isAcceptableOrUnknown(
              data['customer_id']!, _customerIdMeta));
    } else if (isInserting) {
      context.missing(_customerIdMeta);
    }
    if (data.containsKey('submission_time')) {
      context.handle(
          _submissionTimeMeta,
          submissionTime.isAcceptableOrUnknown(
              data['submission_time']!, _submissionTimeMeta));
    } else if (isInserting) {
      context.missing(_submissionTimeMeta);
    }
    if (data.containsKey('is_joint_work')) {
      context.handle(
          _isJointWorkMeta,
          isJointWork.isAcceptableOrUnknown(
              data['is_joint_work']!, _isJointWorkMeta));
    }
    if (data.containsKey('tagged_managers')) {
      context.handle(
          _taggedManagersMeta,
          taggedManagers.isAcceptableOrUnknown(
              data['tagged_managers']!, _taggedManagersMeta));
    }
    if (data.containsKey('is_locked')) {
      context.handle(_isLockedMeta,
          isLocked.isAcceptableOrUnknown(data['is_locked']!, _isLockedMeta));
    }
    if (data.containsKey('created_by')) {
      context.handle(_createdByMeta,
          createdBy.isAcceptableOrUnknown(data['created_by']!, _createdByMeta));
    } else if (isInserting) {
      context.missing(_createdByMeta);
    }
    if (data.containsKey('device_id')) {
      context.handle(_deviceIdMeta,
          deviceId.isAcceptableOrUnknown(data['device_id']!, _deviceIdMeta));
    }
    if (data.containsKey('app_version')) {
      context.handle(
          _appVersionMeta,
          appVersion.isAcceptableOrUnknown(
              data['app_version']!, _appVersionMeta));
    }
    if (data.containsKey('latitude')) {
      context.handle(_latitudeMeta,
          latitude.isAcceptableOrUnknown(data['latitude']!, _latitudeMeta));
    } else if (isInserting) {
      context.missing(_latitudeMeta);
    }
    if (data.containsKey('longitude')) {
      context.handle(_longitudeMeta,
          longitude.isAcceptableOrUnknown(data['longitude']!, _longitudeMeta));
    } else if (isInserting) {
      context.missing(_longitudeMeta);
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {dcrId};
  @override
  DcrSubmissionEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return DcrSubmissionEntry(
      dcrId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}dcr_id'])!,
      checkInId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}check_in_id'])!,
      customerId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_id'])!,
      submissionTime: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}submission_time'])!,
      isJointWork: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_joint_work'])!,
      taggedManagers: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}tagged_managers']),
      isLocked: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_locked'])!,
      createdBy: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}created_by'])!,
      deviceId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}device_id']),
      appVersion: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}app_version']),
      latitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}latitude'])!,
      longitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}longitude'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $DcrSubmissionTableTable createAlias(String alias) {
    return $DcrSubmissionTableTable(attachedDatabase, alias);
  }
}

class DcrSubmissionEntry extends DataClass
    implements Insertable<DcrSubmissionEntry> {
  final String dcrId;
  final String checkInId;
  final String customerId;
  final DateTime submissionTime;
  final bool isJointWork;
  final String? taggedManagers;
  final bool isLocked;
  final String createdBy;
  final String? deviceId;
  final String? appVersion;
  final double latitude;
  final double longitude;
  final int syncStatus;
  const DcrSubmissionEntry(
      {required this.dcrId,
      required this.checkInId,
      required this.customerId,
      required this.submissionTime,
      required this.isJointWork,
      this.taggedManagers,
      required this.isLocked,
      required this.createdBy,
      this.deviceId,
      this.appVersion,
      required this.latitude,
      required this.longitude,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['dcr_id'] = Variable<String>(dcrId);
    map['check_in_id'] = Variable<String>(checkInId);
    map['customer_id'] = Variable<String>(customerId);
    map['submission_time'] = Variable<DateTime>(submissionTime);
    map['is_joint_work'] = Variable<bool>(isJointWork);
    if (!nullToAbsent || taggedManagers != null) {
      map['tagged_managers'] = Variable<String>(taggedManagers);
    }
    map['is_locked'] = Variable<bool>(isLocked);
    map['created_by'] = Variable<String>(createdBy);
    if (!nullToAbsent || deviceId != null) {
      map['device_id'] = Variable<String>(deviceId);
    }
    if (!nullToAbsent || appVersion != null) {
      map['app_version'] = Variable<String>(appVersion);
    }
    map['latitude'] = Variable<double>(latitude);
    map['longitude'] = Variable<double>(longitude);
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  DcrSubmissionTableCompanion toCompanion(bool nullToAbsent) {
    return DcrSubmissionTableCompanion(
      dcrId: Value(dcrId),
      checkInId: Value(checkInId),
      customerId: Value(customerId),
      submissionTime: Value(submissionTime),
      isJointWork: Value(isJointWork),
      taggedManagers: taggedManagers == null && nullToAbsent
          ? const Value.absent()
          : Value(taggedManagers),
      isLocked: Value(isLocked),
      createdBy: Value(createdBy),
      deviceId: deviceId == null && nullToAbsent
          ? const Value.absent()
          : Value(deviceId),
      appVersion: appVersion == null && nullToAbsent
          ? const Value.absent()
          : Value(appVersion),
      latitude: Value(latitude),
      longitude: Value(longitude),
      syncStatus: Value(syncStatus),
    );
  }

  factory DcrSubmissionEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return DcrSubmissionEntry(
      dcrId: serializer.fromJson<String>(json['dcrId']),
      checkInId: serializer.fromJson<String>(json['checkInId']),
      customerId: serializer.fromJson<String>(json['customerId']),
      submissionTime: serializer.fromJson<DateTime>(json['submissionTime']),
      isJointWork: serializer.fromJson<bool>(json['isJointWork']),
      taggedManagers: serializer.fromJson<String?>(json['taggedManagers']),
      isLocked: serializer.fromJson<bool>(json['isLocked']),
      createdBy: serializer.fromJson<String>(json['createdBy']),
      deviceId: serializer.fromJson<String?>(json['deviceId']),
      appVersion: serializer.fromJson<String?>(json['appVersion']),
      latitude: serializer.fromJson<double>(json['latitude']),
      longitude: serializer.fromJson<double>(json['longitude']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'dcrId': serializer.toJson<String>(dcrId),
      'checkInId': serializer.toJson<String>(checkInId),
      'customerId': serializer.toJson<String>(customerId),
      'submissionTime': serializer.toJson<DateTime>(submissionTime),
      'isJointWork': serializer.toJson<bool>(isJointWork),
      'taggedManagers': serializer.toJson<String?>(taggedManagers),
      'isLocked': serializer.toJson<bool>(isLocked),
      'createdBy': serializer.toJson<String>(createdBy),
      'deviceId': serializer.toJson<String?>(deviceId),
      'appVersion': serializer.toJson<String?>(appVersion),
      'latitude': serializer.toJson<double>(latitude),
      'longitude': serializer.toJson<double>(longitude),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  DcrSubmissionEntry copyWith(
          {String? dcrId,
          String? checkInId,
          String? customerId,
          DateTime? submissionTime,
          bool? isJointWork,
          Value<String?> taggedManagers = const Value.absent(),
          bool? isLocked,
          String? createdBy,
          Value<String?> deviceId = const Value.absent(),
          Value<String?> appVersion = const Value.absent(),
          double? latitude,
          double? longitude,
          int? syncStatus}) =>
      DcrSubmissionEntry(
        dcrId: dcrId ?? this.dcrId,
        checkInId: checkInId ?? this.checkInId,
        customerId: customerId ?? this.customerId,
        submissionTime: submissionTime ?? this.submissionTime,
        isJointWork: isJointWork ?? this.isJointWork,
        taggedManagers:
            taggedManagers.present ? taggedManagers.value : this.taggedManagers,
        isLocked: isLocked ?? this.isLocked,
        createdBy: createdBy ?? this.createdBy,
        deviceId: deviceId.present ? deviceId.value : this.deviceId,
        appVersion: appVersion.present ? appVersion.value : this.appVersion,
        latitude: latitude ?? this.latitude,
        longitude: longitude ?? this.longitude,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  DcrSubmissionEntry copyWithCompanion(DcrSubmissionTableCompanion data) {
    return DcrSubmissionEntry(
      dcrId: data.dcrId.present ? data.dcrId.value : this.dcrId,
      checkInId: data.checkInId.present ? data.checkInId.value : this.checkInId,
      customerId:
          data.customerId.present ? data.customerId.value : this.customerId,
      submissionTime: data.submissionTime.present
          ? data.submissionTime.value
          : this.submissionTime,
      isJointWork:
          data.isJointWork.present ? data.isJointWork.value : this.isJointWork,
      taggedManagers: data.taggedManagers.present
          ? data.taggedManagers.value
          : this.taggedManagers,
      isLocked: data.isLocked.present ? data.isLocked.value : this.isLocked,
      createdBy: data.createdBy.present ? data.createdBy.value : this.createdBy,
      deviceId: data.deviceId.present ? data.deviceId.value : this.deviceId,
      appVersion:
          data.appVersion.present ? data.appVersion.value : this.appVersion,
      latitude: data.latitude.present ? data.latitude.value : this.latitude,
      longitude: data.longitude.present ? data.longitude.value : this.longitude,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('DcrSubmissionEntry(')
          ..write('dcrId: $dcrId, ')
          ..write('checkInId: $checkInId, ')
          ..write('customerId: $customerId, ')
          ..write('submissionTime: $submissionTime, ')
          ..write('isJointWork: $isJointWork, ')
          ..write('taggedManagers: $taggedManagers, ')
          ..write('isLocked: $isLocked, ')
          ..write('createdBy: $createdBy, ')
          ..write('deviceId: $deviceId, ')
          ..write('appVersion: $appVersion, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      dcrId,
      checkInId,
      customerId,
      submissionTime,
      isJointWork,
      taggedManagers,
      isLocked,
      createdBy,
      deviceId,
      appVersion,
      latitude,
      longitude,
      syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is DcrSubmissionEntry &&
          other.dcrId == this.dcrId &&
          other.checkInId == this.checkInId &&
          other.customerId == this.customerId &&
          other.submissionTime == this.submissionTime &&
          other.isJointWork == this.isJointWork &&
          other.taggedManagers == this.taggedManagers &&
          other.isLocked == this.isLocked &&
          other.createdBy == this.createdBy &&
          other.deviceId == this.deviceId &&
          other.appVersion == this.appVersion &&
          other.latitude == this.latitude &&
          other.longitude == this.longitude &&
          other.syncStatus == this.syncStatus);
}

class DcrSubmissionTableCompanion extends UpdateCompanion<DcrSubmissionEntry> {
  final Value<String> dcrId;
  final Value<String> checkInId;
  final Value<String> customerId;
  final Value<DateTime> submissionTime;
  final Value<bool> isJointWork;
  final Value<String?> taggedManagers;
  final Value<bool> isLocked;
  final Value<String> createdBy;
  final Value<String?> deviceId;
  final Value<String?> appVersion;
  final Value<double> latitude;
  final Value<double> longitude;
  final Value<int> syncStatus;
  final Value<int> rowid;
  const DcrSubmissionTableCompanion({
    this.dcrId = const Value.absent(),
    this.checkInId = const Value.absent(),
    this.customerId = const Value.absent(),
    this.submissionTime = const Value.absent(),
    this.isJointWork = const Value.absent(),
    this.taggedManagers = const Value.absent(),
    this.isLocked = const Value.absent(),
    this.createdBy = const Value.absent(),
    this.deviceId = const Value.absent(),
    this.appVersion = const Value.absent(),
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  DcrSubmissionTableCompanion.insert({
    required String dcrId,
    required String checkInId,
    required String customerId,
    required DateTime submissionTime,
    this.isJointWork = const Value.absent(),
    this.taggedManagers = const Value.absent(),
    this.isLocked = const Value.absent(),
    required String createdBy,
    this.deviceId = const Value.absent(),
    this.appVersion = const Value.absent(),
    required double latitude,
    required double longitude,
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : dcrId = Value(dcrId),
        checkInId = Value(checkInId),
        customerId = Value(customerId),
        submissionTime = Value(submissionTime),
        createdBy = Value(createdBy),
        latitude = Value(latitude),
        longitude = Value(longitude);
  static Insertable<DcrSubmissionEntry> custom({
    Expression<String>? dcrId,
    Expression<String>? checkInId,
    Expression<String>? customerId,
    Expression<DateTime>? submissionTime,
    Expression<bool>? isJointWork,
    Expression<String>? taggedManagers,
    Expression<bool>? isLocked,
    Expression<String>? createdBy,
    Expression<String>? deviceId,
    Expression<String>? appVersion,
    Expression<double>? latitude,
    Expression<double>? longitude,
    Expression<int>? syncStatus,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (dcrId != null) 'dcr_id': dcrId,
      if (checkInId != null) 'check_in_id': checkInId,
      if (customerId != null) 'customer_id': customerId,
      if (submissionTime != null) 'submission_time': submissionTime,
      if (isJointWork != null) 'is_joint_work': isJointWork,
      if (taggedManagers != null) 'tagged_managers': taggedManagers,
      if (isLocked != null) 'is_locked': isLocked,
      if (createdBy != null) 'created_by': createdBy,
      if (deviceId != null) 'device_id': deviceId,
      if (appVersion != null) 'app_version': appVersion,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (rowid != null) 'rowid': rowid,
    });
  }

  DcrSubmissionTableCompanion copyWith(
      {Value<String>? dcrId,
      Value<String>? checkInId,
      Value<String>? customerId,
      Value<DateTime>? submissionTime,
      Value<bool>? isJointWork,
      Value<String?>? taggedManagers,
      Value<bool>? isLocked,
      Value<String>? createdBy,
      Value<String?>? deviceId,
      Value<String?>? appVersion,
      Value<double>? latitude,
      Value<double>? longitude,
      Value<int>? syncStatus,
      Value<int>? rowid}) {
    return DcrSubmissionTableCompanion(
      dcrId: dcrId ?? this.dcrId,
      checkInId: checkInId ?? this.checkInId,
      customerId: customerId ?? this.customerId,
      submissionTime: submissionTime ?? this.submissionTime,
      isJointWork: isJointWork ?? this.isJointWork,
      taggedManagers: taggedManagers ?? this.taggedManagers,
      isLocked: isLocked ?? this.isLocked,
      createdBy: createdBy ?? this.createdBy,
      deviceId: deviceId ?? this.deviceId,
      appVersion: appVersion ?? this.appVersion,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      syncStatus: syncStatus ?? this.syncStatus,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (dcrId.present) {
      map['dcr_id'] = Variable<String>(dcrId.value);
    }
    if (checkInId.present) {
      map['check_in_id'] = Variable<String>(checkInId.value);
    }
    if (customerId.present) {
      map['customer_id'] = Variable<String>(customerId.value);
    }
    if (submissionTime.present) {
      map['submission_time'] = Variable<DateTime>(submissionTime.value);
    }
    if (isJointWork.present) {
      map['is_joint_work'] = Variable<bool>(isJointWork.value);
    }
    if (taggedManagers.present) {
      map['tagged_managers'] = Variable<String>(taggedManagers.value);
    }
    if (isLocked.present) {
      map['is_locked'] = Variable<bool>(isLocked.value);
    }
    if (createdBy.present) {
      map['created_by'] = Variable<String>(createdBy.value);
    }
    if (deviceId.present) {
      map['device_id'] = Variable<String>(deviceId.value);
    }
    if (appVersion.present) {
      map['app_version'] = Variable<String>(appVersion.value);
    }
    if (latitude.present) {
      map['latitude'] = Variable<double>(latitude.value);
    }
    if (longitude.present) {
      map['longitude'] = Variable<double>(longitude.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DcrSubmissionTableCompanion(')
          ..write('dcrId: $dcrId, ')
          ..write('checkInId: $checkInId, ')
          ..write('customerId: $customerId, ')
          ..write('submissionTime: $submissionTime, ')
          ..write('isJointWork: $isJointWork, ')
          ..write('taggedManagers: $taggedManagers, ')
          ..write('isLocked: $isLocked, ')
          ..write('createdBy: $createdBy, ')
          ..write('deviceId: $deviceId, ')
          ..write('appVersion: $appVersion, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $DeviationTableTable extends DeviationTable
    with TableInfo<$DeviationTableTable, DeviationEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DeviationTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _employeeIdMeta =
      const VerificationMeta('employeeId');
  @override
  late final GeneratedColumn<String> employeeId = GeneratedColumn<String>(
      'employee_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerIdMeta =
      const VerificationMeta('customerId');
  @override
  late final GeneratedColumn<String> customerId = GeneratedColumn<String>(
      'customer_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _reasonMeta = const VerificationMeta('reason');
  @override
  late final GeneratedColumn<String> reason = GeneratedColumn<String>(
      'reason', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _remarksMeta =
      const VerificationMeta('remarks');
  @override
  late final GeneratedColumn<String> remarks = GeneratedColumn<String>(
      'remarks', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _deviationDateMeta =
      const VerificationMeta('deviationDate');
  @override
  late final GeneratedColumn<DateTime> deviationDate =
      GeneratedColumn<DateTime>('deviation_date', aliasedName, false,
          type: DriftSqlType.dateTime,
          requiredDuringInsert: false,
          defaultValue: currentDateAndTime);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns =>
      [id, employeeId, customerId, reason, remarks, deviationDate, syncStatus];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'deviation_table';
  @override
  VerificationContext validateIntegrity(Insertable<DeviationEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('employee_id')) {
      context.handle(
          _employeeIdMeta,
          employeeId.isAcceptableOrUnknown(
              data['employee_id']!, _employeeIdMeta));
    } else if (isInserting) {
      context.missing(_employeeIdMeta);
    }
    if (data.containsKey('customer_id')) {
      context.handle(
          _customerIdMeta,
          customerId.isAcceptableOrUnknown(
              data['customer_id']!, _customerIdMeta));
    } else if (isInserting) {
      context.missing(_customerIdMeta);
    }
    if (data.containsKey('reason')) {
      context.handle(_reasonMeta,
          reason.isAcceptableOrUnknown(data['reason']!, _reasonMeta));
    } else if (isInserting) {
      context.missing(_reasonMeta);
    }
    if (data.containsKey('remarks')) {
      context.handle(_remarksMeta,
          remarks.isAcceptableOrUnknown(data['remarks']!, _remarksMeta));
    }
    if (data.containsKey('deviation_date')) {
      context.handle(
          _deviationDateMeta,
          deviationDate.isAcceptableOrUnknown(
              data['deviation_date']!, _deviationDateMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  DeviationEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return DeviationEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      employeeId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}employee_id'])!,
      customerId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_id'])!,
      reason: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}reason'])!,
      remarks: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}remarks']),
      deviationDate: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}deviation_date'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $DeviationTableTable createAlias(String alias) {
    return $DeviationTableTable(attachedDatabase, alias);
  }
}

class DeviationEntry extends DataClass implements Insertable<DeviationEntry> {
  final int id;
  final String employeeId;
  final String customerId;
  final String reason;
  final String? remarks;
  final DateTime deviationDate;
  final int syncStatus;
  const DeviationEntry(
      {required this.id,
      required this.employeeId,
      required this.customerId,
      required this.reason,
      this.remarks,
      required this.deviationDate,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['employee_id'] = Variable<String>(employeeId);
    map['customer_id'] = Variable<String>(customerId);
    map['reason'] = Variable<String>(reason);
    if (!nullToAbsent || remarks != null) {
      map['remarks'] = Variable<String>(remarks);
    }
    map['deviation_date'] = Variable<DateTime>(deviationDate);
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  DeviationTableCompanion toCompanion(bool nullToAbsent) {
    return DeviationTableCompanion(
      id: Value(id),
      employeeId: Value(employeeId),
      customerId: Value(customerId),
      reason: Value(reason),
      remarks: remarks == null && nullToAbsent
          ? const Value.absent()
          : Value(remarks),
      deviationDate: Value(deviationDate),
      syncStatus: Value(syncStatus),
    );
  }

  factory DeviationEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return DeviationEntry(
      id: serializer.fromJson<int>(json['id']),
      employeeId: serializer.fromJson<String>(json['employeeId']),
      customerId: serializer.fromJson<String>(json['customerId']),
      reason: serializer.fromJson<String>(json['reason']),
      remarks: serializer.fromJson<String?>(json['remarks']),
      deviationDate: serializer.fromJson<DateTime>(json['deviationDate']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'employeeId': serializer.toJson<String>(employeeId),
      'customerId': serializer.toJson<String>(customerId),
      'reason': serializer.toJson<String>(reason),
      'remarks': serializer.toJson<String?>(remarks),
      'deviationDate': serializer.toJson<DateTime>(deviationDate),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  DeviationEntry copyWith(
          {int? id,
          String? employeeId,
          String? customerId,
          String? reason,
          Value<String?> remarks = const Value.absent(),
          DateTime? deviationDate,
          int? syncStatus}) =>
      DeviationEntry(
        id: id ?? this.id,
        employeeId: employeeId ?? this.employeeId,
        customerId: customerId ?? this.customerId,
        reason: reason ?? this.reason,
        remarks: remarks.present ? remarks.value : this.remarks,
        deviationDate: deviationDate ?? this.deviationDate,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  DeviationEntry copyWithCompanion(DeviationTableCompanion data) {
    return DeviationEntry(
      id: data.id.present ? data.id.value : this.id,
      employeeId:
          data.employeeId.present ? data.employeeId.value : this.employeeId,
      customerId:
          data.customerId.present ? data.customerId.value : this.customerId,
      reason: data.reason.present ? data.reason.value : this.reason,
      remarks: data.remarks.present ? data.remarks.value : this.remarks,
      deviationDate: data.deviationDate.present
          ? data.deviationDate.value
          : this.deviationDate,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('DeviationEntry(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('customerId: $customerId, ')
          ..write('reason: $reason, ')
          ..write('remarks: $remarks, ')
          ..write('deviationDate: $deviationDate, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id, employeeId, customerId, reason, remarks, deviationDate, syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is DeviationEntry &&
          other.id == this.id &&
          other.employeeId == this.employeeId &&
          other.customerId == this.customerId &&
          other.reason == this.reason &&
          other.remarks == this.remarks &&
          other.deviationDate == this.deviationDate &&
          other.syncStatus == this.syncStatus);
}

class DeviationTableCompanion extends UpdateCompanion<DeviationEntry> {
  final Value<int> id;
  final Value<String> employeeId;
  final Value<String> customerId;
  final Value<String> reason;
  final Value<String?> remarks;
  final Value<DateTime> deviationDate;
  final Value<int> syncStatus;
  const DeviationTableCompanion({
    this.id = const Value.absent(),
    this.employeeId = const Value.absent(),
    this.customerId = const Value.absent(),
    this.reason = const Value.absent(),
    this.remarks = const Value.absent(),
    this.deviationDate = const Value.absent(),
    this.syncStatus = const Value.absent(),
  });
  DeviationTableCompanion.insert({
    this.id = const Value.absent(),
    required String employeeId,
    required String customerId,
    required String reason,
    this.remarks = const Value.absent(),
    this.deviationDate = const Value.absent(),
    this.syncStatus = const Value.absent(),
  })  : employeeId = Value(employeeId),
        customerId = Value(customerId),
        reason = Value(reason);
  static Insertable<DeviationEntry> custom({
    Expression<int>? id,
    Expression<String>? employeeId,
    Expression<String>? customerId,
    Expression<String>? reason,
    Expression<String>? remarks,
    Expression<DateTime>? deviationDate,
    Expression<int>? syncStatus,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (employeeId != null) 'employee_id': employeeId,
      if (customerId != null) 'customer_id': customerId,
      if (reason != null) 'reason': reason,
      if (remarks != null) 'remarks': remarks,
      if (deviationDate != null) 'deviation_date': deviationDate,
      if (syncStatus != null) 'sync_status': syncStatus,
    });
  }

  DeviationTableCompanion copyWith(
      {Value<int>? id,
      Value<String>? employeeId,
      Value<String>? customerId,
      Value<String>? reason,
      Value<String?>? remarks,
      Value<DateTime>? deviationDate,
      Value<int>? syncStatus}) {
    return DeviationTableCompanion(
      id: id ?? this.id,
      employeeId: employeeId ?? this.employeeId,
      customerId: customerId ?? this.customerId,
      reason: reason ?? this.reason,
      remarks: remarks ?? this.remarks,
      deviationDate: deviationDate ?? this.deviationDate,
      syncStatus: syncStatus ?? this.syncStatus,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (employeeId.present) {
      map['employee_id'] = Variable<String>(employeeId.value);
    }
    if (customerId.present) {
      map['customer_id'] = Variable<String>(customerId.value);
    }
    if (reason.present) {
      map['reason'] = Variable<String>(reason.value);
    }
    if (remarks.present) {
      map['remarks'] = Variable<String>(remarks.value);
    }
    if (deviationDate.present) {
      map['deviation_date'] = Variable<DateTime>(deviationDate.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DeviationTableCompanion(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('customerId: $customerId, ')
          ..write('reason: $reason, ')
          ..write('remarks: $remarks, ')
          ..write('deviationDate: $deviationDate, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }
}

class $ExpenseApprovalTableTable extends ExpenseApprovalTable
    with TableInfo<$ExpenseApprovalTableTable, ExpenseApprovalEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ExpenseApprovalTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _expenseIdMeta =
      const VerificationMeta('expenseId');
  @override
  late final GeneratedColumn<String> expenseId = GeneratedColumn<String>(
      'expense_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _approverIdMeta =
      const VerificationMeta('approverId');
  @override
  late final GeneratedColumn<String> approverId = GeneratedColumn<String>(
      'approver_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _approverRoleMeta =
      const VerificationMeta('approverRole');
  @override
  late final GeneratedColumn<String> approverRole = GeneratedColumn<String>(
      'approver_role', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
      'status', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _claimAmountMeta =
      const VerificationMeta('claimAmount');
  @override
  late final GeneratedColumn<double> claimAmount = GeneratedColumn<double>(
      'claim_amount', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _approvedAmountMeta =
      const VerificationMeta('approvedAmount');
  @override
  late final GeneratedColumn<double> approvedAmount = GeneratedColumn<double>(
      'approved_amount', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _rejectedAmountMeta =
      const VerificationMeta('rejectedAmount');
  @override
  late final GeneratedColumn<double> rejectedAmount = GeneratedColumn<double>(
      'rejected_amount', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _adjustmentReasonMeta =
      const VerificationMeta('adjustmentReason');
  @override
  late final GeneratedColumn<String> adjustmentReason = GeneratedColumn<String>(
      'adjustment_reason', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _remarksMeta =
      const VerificationMeta('remarks');
  @override
  late final GeneratedColumn<String> remarks = GeneratedColumn<String>(
      'remarks', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns => [
        id,
        expenseId,
        approverId,
        approverRole,
        status,
        claimAmount,
        approvedAmount,
        rejectedAmount,
        adjustmentReason,
        remarks,
        syncStatus
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'expense_approval_table';
  @override
  VerificationContext validateIntegrity(
      Insertable<ExpenseApprovalEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('expense_id')) {
      context.handle(_expenseIdMeta,
          expenseId.isAcceptableOrUnknown(data['expense_id']!, _expenseIdMeta));
    } else if (isInserting) {
      context.missing(_expenseIdMeta);
    }
    if (data.containsKey('approver_id')) {
      context.handle(
          _approverIdMeta,
          approverId.isAcceptableOrUnknown(
              data['approver_id']!, _approverIdMeta));
    } else if (isInserting) {
      context.missing(_approverIdMeta);
    }
    if (data.containsKey('approver_role')) {
      context.handle(
          _approverRoleMeta,
          approverRole.isAcceptableOrUnknown(
              data['approver_role']!, _approverRoleMeta));
    } else if (isInserting) {
      context.missing(_approverRoleMeta);
    }
    if (data.containsKey('status')) {
      context.handle(_statusMeta,
          status.isAcceptableOrUnknown(data['status']!, _statusMeta));
    } else if (isInserting) {
      context.missing(_statusMeta);
    }
    if (data.containsKey('claim_amount')) {
      context.handle(
          _claimAmountMeta,
          claimAmount.isAcceptableOrUnknown(
              data['claim_amount']!, _claimAmountMeta));
    } else if (isInserting) {
      context.missing(_claimAmountMeta);
    }
    if (data.containsKey('approved_amount')) {
      context.handle(
          _approvedAmountMeta,
          approvedAmount.isAcceptableOrUnknown(
              data['approved_amount']!, _approvedAmountMeta));
    }
    if (data.containsKey('rejected_amount')) {
      context.handle(
          _rejectedAmountMeta,
          rejectedAmount.isAcceptableOrUnknown(
              data['rejected_amount']!, _rejectedAmountMeta));
    }
    if (data.containsKey('adjustment_reason')) {
      context.handle(
          _adjustmentReasonMeta,
          adjustmentReason.isAcceptableOrUnknown(
              data['adjustment_reason']!, _adjustmentReasonMeta));
    }
    if (data.containsKey('remarks')) {
      context.handle(_remarksMeta,
          remarks.isAcceptableOrUnknown(data['remarks']!, _remarksMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  ExpenseApprovalEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ExpenseApprovalEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      expenseId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}expense_id'])!,
      approverId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}approver_id'])!,
      approverRole: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}approver_role'])!,
      status: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}status'])!,
      claimAmount: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}claim_amount'])!,
      approvedAmount: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}approved_amount']),
      rejectedAmount: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}rejected_amount']),
      adjustmentReason: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}adjustment_reason']),
      remarks: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}remarks']),
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $ExpenseApprovalTableTable createAlias(String alias) {
    return $ExpenseApprovalTableTable(attachedDatabase, alias);
  }
}

class ExpenseApprovalEntry extends DataClass
    implements Insertable<ExpenseApprovalEntry> {
  final String id;
  final String expenseId;
  final String approverId;
  final String approverRole;
  final String status;
  final double claimAmount;
  final double? approvedAmount;
  final double? rejectedAmount;
  final String? adjustmentReason;
  final String? remarks;
  final int syncStatus;
  const ExpenseApprovalEntry(
      {required this.id,
      required this.expenseId,
      required this.approverId,
      required this.approverRole,
      required this.status,
      required this.claimAmount,
      this.approvedAmount,
      this.rejectedAmount,
      this.adjustmentReason,
      this.remarks,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['expense_id'] = Variable<String>(expenseId);
    map['approver_id'] = Variable<String>(approverId);
    map['approver_role'] = Variable<String>(approverRole);
    map['status'] = Variable<String>(status);
    map['claim_amount'] = Variable<double>(claimAmount);
    if (!nullToAbsent || approvedAmount != null) {
      map['approved_amount'] = Variable<double>(approvedAmount);
    }
    if (!nullToAbsent || rejectedAmount != null) {
      map['rejected_amount'] = Variable<double>(rejectedAmount);
    }
    if (!nullToAbsent || adjustmentReason != null) {
      map['adjustment_reason'] = Variable<String>(adjustmentReason);
    }
    if (!nullToAbsent || remarks != null) {
      map['remarks'] = Variable<String>(remarks);
    }
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  ExpenseApprovalTableCompanion toCompanion(bool nullToAbsent) {
    return ExpenseApprovalTableCompanion(
      id: Value(id),
      expenseId: Value(expenseId),
      approverId: Value(approverId),
      approverRole: Value(approverRole),
      status: Value(status),
      claimAmount: Value(claimAmount),
      approvedAmount: approvedAmount == null && nullToAbsent
          ? const Value.absent()
          : Value(approvedAmount),
      rejectedAmount: rejectedAmount == null && nullToAbsent
          ? const Value.absent()
          : Value(rejectedAmount),
      adjustmentReason: adjustmentReason == null && nullToAbsent
          ? const Value.absent()
          : Value(adjustmentReason),
      remarks: remarks == null && nullToAbsent
          ? const Value.absent()
          : Value(remarks),
      syncStatus: Value(syncStatus),
    );
  }

  factory ExpenseApprovalEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ExpenseApprovalEntry(
      id: serializer.fromJson<String>(json['id']),
      expenseId: serializer.fromJson<String>(json['expenseId']),
      approverId: serializer.fromJson<String>(json['approverId']),
      approverRole: serializer.fromJson<String>(json['approverRole']),
      status: serializer.fromJson<String>(json['status']),
      claimAmount: serializer.fromJson<double>(json['claimAmount']),
      approvedAmount: serializer.fromJson<double?>(json['approvedAmount']),
      rejectedAmount: serializer.fromJson<double?>(json['rejectedAmount']),
      adjustmentReason: serializer.fromJson<String?>(json['adjustmentReason']),
      remarks: serializer.fromJson<String?>(json['remarks']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'expenseId': serializer.toJson<String>(expenseId),
      'approverId': serializer.toJson<String>(approverId),
      'approverRole': serializer.toJson<String>(approverRole),
      'status': serializer.toJson<String>(status),
      'claimAmount': serializer.toJson<double>(claimAmount),
      'approvedAmount': serializer.toJson<double?>(approvedAmount),
      'rejectedAmount': serializer.toJson<double?>(rejectedAmount),
      'adjustmentReason': serializer.toJson<String?>(adjustmentReason),
      'remarks': serializer.toJson<String?>(remarks),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  ExpenseApprovalEntry copyWith(
          {String? id,
          String? expenseId,
          String? approverId,
          String? approverRole,
          String? status,
          double? claimAmount,
          Value<double?> approvedAmount = const Value.absent(),
          Value<double?> rejectedAmount = const Value.absent(),
          Value<String?> adjustmentReason = const Value.absent(),
          Value<String?> remarks = const Value.absent(),
          int? syncStatus}) =>
      ExpenseApprovalEntry(
        id: id ?? this.id,
        expenseId: expenseId ?? this.expenseId,
        approverId: approverId ?? this.approverId,
        approverRole: approverRole ?? this.approverRole,
        status: status ?? this.status,
        claimAmount: claimAmount ?? this.claimAmount,
        approvedAmount:
            approvedAmount.present ? approvedAmount.value : this.approvedAmount,
        rejectedAmount:
            rejectedAmount.present ? rejectedAmount.value : this.rejectedAmount,
        adjustmentReason: adjustmentReason.present
            ? adjustmentReason.value
            : this.adjustmentReason,
        remarks: remarks.present ? remarks.value : this.remarks,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  ExpenseApprovalEntry copyWithCompanion(ExpenseApprovalTableCompanion data) {
    return ExpenseApprovalEntry(
      id: data.id.present ? data.id.value : this.id,
      expenseId: data.expenseId.present ? data.expenseId.value : this.expenseId,
      approverId:
          data.approverId.present ? data.approverId.value : this.approverId,
      approverRole: data.approverRole.present
          ? data.approverRole.value
          : this.approverRole,
      status: data.status.present ? data.status.value : this.status,
      claimAmount:
          data.claimAmount.present ? data.claimAmount.value : this.claimAmount,
      approvedAmount: data.approvedAmount.present
          ? data.approvedAmount.value
          : this.approvedAmount,
      rejectedAmount: data.rejectedAmount.present
          ? data.rejectedAmount.value
          : this.rejectedAmount,
      adjustmentReason: data.adjustmentReason.present
          ? data.adjustmentReason.value
          : this.adjustmentReason,
      remarks: data.remarks.present ? data.remarks.value : this.remarks,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ExpenseApprovalEntry(')
          ..write('id: $id, ')
          ..write('expenseId: $expenseId, ')
          ..write('approverId: $approverId, ')
          ..write('approverRole: $approverRole, ')
          ..write('status: $status, ')
          ..write('claimAmount: $claimAmount, ')
          ..write('approvedAmount: $approvedAmount, ')
          ..write('rejectedAmount: $rejectedAmount, ')
          ..write('adjustmentReason: $adjustmentReason, ')
          ..write('remarks: $remarks, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      expenseId,
      approverId,
      approverRole,
      status,
      claimAmount,
      approvedAmount,
      rejectedAmount,
      adjustmentReason,
      remarks,
      syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ExpenseApprovalEntry &&
          other.id == this.id &&
          other.expenseId == this.expenseId &&
          other.approverId == this.approverId &&
          other.approverRole == this.approverRole &&
          other.status == this.status &&
          other.claimAmount == this.claimAmount &&
          other.approvedAmount == this.approvedAmount &&
          other.rejectedAmount == this.rejectedAmount &&
          other.adjustmentReason == this.adjustmentReason &&
          other.remarks == this.remarks &&
          other.syncStatus == this.syncStatus);
}

class ExpenseApprovalTableCompanion
    extends UpdateCompanion<ExpenseApprovalEntry> {
  final Value<String> id;
  final Value<String> expenseId;
  final Value<String> approverId;
  final Value<String> approverRole;
  final Value<String> status;
  final Value<double> claimAmount;
  final Value<double?> approvedAmount;
  final Value<double?> rejectedAmount;
  final Value<String?> adjustmentReason;
  final Value<String?> remarks;
  final Value<int> syncStatus;
  final Value<int> rowid;
  const ExpenseApprovalTableCompanion({
    this.id = const Value.absent(),
    this.expenseId = const Value.absent(),
    this.approverId = const Value.absent(),
    this.approverRole = const Value.absent(),
    this.status = const Value.absent(),
    this.claimAmount = const Value.absent(),
    this.approvedAmount = const Value.absent(),
    this.rejectedAmount = const Value.absent(),
    this.adjustmentReason = const Value.absent(),
    this.remarks = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ExpenseApprovalTableCompanion.insert({
    required String id,
    required String expenseId,
    required String approverId,
    required String approverRole,
    required String status,
    required double claimAmount,
    this.approvedAmount = const Value.absent(),
    this.rejectedAmount = const Value.absent(),
    this.adjustmentReason = const Value.absent(),
    this.remarks = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        expenseId = Value(expenseId),
        approverId = Value(approverId),
        approverRole = Value(approverRole),
        status = Value(status),
        claimAmount = Value(claimAmount);
  static Insertable<ExpenseApprovalEntry> custom({
    Expression<String>? id,
    Expression<String>? expenseId,
    Expression<String>? approverId,
    Expression<String>? approverRole,
    Expression<String>? status,
    Expression<double>? claimAmount,
    Expression<double>? approvedAmount,
    Expression<double>? rejectedAmount,
    Expression<String>? adjustmentReason,
    Expression<String>? remarks,
    Expression<int>? syncStatus,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (expenseId != null) 'expense_id': expenseId,
      if (approverId != null) 'approver_id': approverId,
      if (approverRole != null) 'approver_role': approverRole,
      if (status != null) 'status': status,
      if (claimAmount != null) 'claim_amount': claimAmount,
      if (approvedAmount != null) 'approved_amount': approvedAmount,
      if (rejectedAmount != null) 'rejected_amount': rejectedAmount,
      if (adjustmentReason != null) 'adjustment_reason': adjustmentReason,
      if (remarks != null) 'remarks': remarks,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ExpenseApprovalTableCompanion copyWith(
      {Value<String>? id,
      Value<String>? expenseId,
      Value<String>? approverId,
      Value<String>? approverRole,
      Value<String>? status,
      Value<double>? claimAmount,
      Value<double?>? approvedAmount,
      Value<double?>? rejectedAmount,
      Value<String?>? adjustmentReason,
      Value<String?>? remarks,
      Value<int>? syncStatus,
      Value<int>? rowid}) {
    return ExpenseApprovalTableCompanion(
      id: id ?? this.id,
      expenseId: expenseId ?? this.expenseId,
      approverId: approverId ?? this.approverId,
      approverRole: approverRole ?? this.approverRole,
      status: status ?? this.status,
      claimAmount: claimAmount ?? this.claimAmount,
      approvedAmount: approvedAmount ?? this.approvedAmount,
      rejectedAmount: rejectedAmount ?? this.rejectedAmount,
      adjustmentReason: adjustmentReason ?? this.adjustmentReason,
      remarks: remarks ?? this.remarks,
      syncStatus: syncStatus ?? this.syncStatus,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (expenseId.present) {
      map['expense_id'] = Variable<String>(expenseId.value);
    }
    if (approverId.present) {
      map['approver_id'] = Variable<String>(approverId.value);
    }
    if (approverRole.present) {
      map['approver_role'] = Variable<String>(approverRole.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (claimAmount.present) {
      map['claim_amount'] = Variable<double>(claimAmount.value);
    }
    if (approvedAmount.present) {
      map['approved_amount'] = Variable<double>(approvedAmount.value);
    }
    if (rejectedAmount.present) {
      map['rejected_amount'] = Variable<double>(rejectedAmount.value);
    }
    if (adjustmentReason.present) {
      map['adjustment_reason'] = Variable<String>(adjustmentReason.value);
    }
    if (remarks.present) {
      map['remarks'] = Variable<String>(remarks.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ExpenseApprovalTableCompanion(')
          ..write('id: $id, ')
          ..write('expenseId: $expenseId, ')
          ..write('approverId: $approverId, ')
          ..write('approverRole: $approverRole, ')
          ..write('status: $status, ')
          ..write('claimAmount: $claimAmount, ')
          ..write('approvedAmount: $approvedAmount, ')
          ..write('rejectedAmount: $rejectedAmount, ')
          ..write('adjustmentReason: $adjustmentReason, ')
          ..write('remarks: $remarks, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $ExpenseAuditTableTable extends ExpenseAuditTable
    with TableInfo<$ExpenseAuditTableTable, ExpenseAuditEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ExpenseAuditTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _expenseIdMeta =
      const VerificationMeta('expenseId');
  @override
  late final GeneratedColumn<String> expenseId = GeneratedColumn<String>(
      'expense_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _actionMeta = const VerificationMeta('action');
  @override
  late final GeneratedColumn<String> action = GeneratedColumn<String>(
      'action', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _performedByMeta =
      const VerificationMeta('performedBy');
  @override
  late final GeneratedColumn<String> performedBy = GeneratedColumn<String>(
      'performed_by', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _roleMeta = const VerificationMeta('role');
  @override
  late final GeneratedColumn<String> role = GeneratedColumn<String>(
      'role', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _timestampMeta =
      const VerificationMeta('timestamp');
  @override
  late final GeneratedColumn<String> timestamp = GeneratedColumn<String>(
      'timestamp', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _deviceIdMeta =
      const VerificationMeta('deviceId');
  @override
  late final GeneratedColumn<String> deviceId = GeneratedColumn<String>(
      'device_id', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _detailsMeta =
      const VerificationMeta('details');
  @override
  late final GeneratedColumn<String> details = GeneratedColumn<String>(
      'details', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns => [
        id,
        expenseId,
        action,
        performedBy,
        role,
        timestamp,
        deviceId,
        details,
        syncStatus
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'expense_audit_table';
  @override
  VerificationContext validateIntegrity(Insertable<ExpenseAuditEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('expense_id')) {
      context.handle(_expenseIdMeta,
          expenseId.isAcceptableOrUnknown(data['expense_id']!, _expenseIdMeta));
    } else if (isInserting) {
      context.missing(_expenseIdMeta);
    }
    if (data.containsKey('action')) {
      context.handle(_actionMeta,
          action.isAcceptableOrUnknown(data['action']!, _actionMeta));
    } else if (isInserting) {
      context.missing(_actionMeta);
    }
    if (data.containsKey('performed_by')) {
      context.handle(
          _performedByMeta,
          performedBy.isAcceptableOrUnknown(
              data['performed_by']!, _performedByMeta));
    } else if (isInserting) {
      context.missing(_performedByMeta);
    }
    if (data.containsKey('role')) {
      context.handle(
          _roleMeta, role.isAcceptableOrUnknown(data['role']!, _roleMeta));
    } else if (isInserting) {
      context.missing(_roleMeta);
    }
    if (data.containsKey('timestamp')) {
      context.handle(_timestampMeta,
          timestamp.isAcceptableOrUnknown(data['timestamp']!, _timestampMeta));
    } else if (isInserting) {
      context.missing(_timestampMeta);
    }
    if (data.containsKey('device_id')) {
      context.handle(_deviceIdMeta,
          deviceId.isAcceptableOrUnknown(data['device_id']!, _deviceIdMeta));
    }
    if (data.containsKey('details')) {
      context.handle(_detailsMeta,
          details.isAcceptableOrUnknown(data['details']!, _detailsMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  ExpenseAuditEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ExpenseAuditEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      expenseId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}expense_id'])!,
      action: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}action'])!,
      performedBy: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}performed_by'])!,
      role: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}role'])!,
      timestamp: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}timestamp'])!,
      deviceId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}device_id']),
      details: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}details']),
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $ExpenseAuditTableTable createAlias(String alias) {
    return $ExpenseAuditTableTable(attachedDatabase, alias);
  }
}

class ExpenseAuditEntry extends DataClass
    implements Insertable<ExpenseAuditEntry> {
  final String id;
  final String expenseId;
  final String action;
  final String performedBy;
  final String role;
  final String timestamp;
  final String? deviceId;
  final String? details;
  final int syncStatus;
  const ExpenseAuditEntry(
      {required this.id,
      required this.expenseId,
      required this.action,
      required this.performedBy,
      required this.role,
      required this.timestamp,
      this.deviceId,
      this.details,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['expense_id'] = Variable<String>(expenseId);
    map['action'] = Variable<String>(action);
    map['performed_by'] = Variable<String>(performedBy);
    map['role'] = Variable<String>(role);
    map['timestamp'] = Variable<String>(timestamp);
    if (!nullToAbsent || deviceId != null) {
      map['device_id'] = Variable<String>(deviceId);
    }
    if (!nullToAbsent || details != null) {
      map['details'] = Variable<String>(details);
    }
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  ExpenseAuditTableCompanion toCompanion(bool nullToAbsent) {
    return ExpenseAuditTableCompanion(
      id: Value(id),
      expenseId: Value(expenseId),
      action: Value(action),
      performedBy: Value(performedBy),
      role: Value(role),
      timestamp: Value(timestamp),
      deviceId: deviceId == null && nullToAbsent
          ? const Value.absent()
          : Value(deviceId),
      details: details == null && nullToAbsent
          ? const Value.absent()
          : Value(details),
      syncStatus: Value(syncStatus),
    );
  }

  factory ExpenseAuditEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ExpenseAuditEntry(
      id: serializer.fromJson<String>(json['id']),
      expenseId: serializer.fromJson<String>(json['expenseId']),
      action: serializer.fromJson<String>(json['action']),
      performedBy: serializer.fromJson<String>(json['performedBy']),
      role: serializer.fromJson<String>(json['role']),
      timestamp: serializer.fromJson<String>(json['timestamp']),
      deviceId: serializer.fromJson<String?>(json['deviceId']),
      details: serializer.fromJson<String?>(json['details']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'expenseId': serializer.toJson<String>(expenseId),
      'action': serializer.toJson<String>(action),
      'performedBy': serializer.toJson<String>(performedBy),
      'role': serializer.toJson<String>(role),
      'timestamp': serializer.toJson<String>(timestamp),
      'deviceId': serializer.toJson<String?>(deviceId),
      'details': serializer.toJson<String?>(details),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  ExpenseAuditEntry copyWith(
          {String? id,
          String? expenseId,
          String? action,
          String? performedBy,
          String? role,
          String? timestamp,
          Value<String?> deviceId = const Value.absent(),
          Value<String?> details = const Value.absent(),
          int? syncStatus}) =>
      ExpenseAuditEntry(
        id: id ?? this.id,
        expenseId: expenseId ?? this.expenseId,
        action: action ?? this.action,
        performedBy: performedBy ?? this.performedBy,
        role: role ?? this.role,
        timestamp: timestamp ?? this.timestamp,
        deviceId: deviceId.present ? deviceId.value : this.deviceId,
        details: details.present ? details.value : this.details,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  ExpenseAuditEntry copyWithCompanion(ExpenseAuditTableCompanion data) {
    return ExpenseAuditEntry(
      id: data.id.present ? data.id.value : this.id,
      expenseId: data.expenseId.present ? data.expenseId.value : this.expenseId,
      action: data.action.present ? data.action.value : this.action,
      performedBy:
          data.performedBy.present ? data.performedBy.value : this.performedBy,
      role: data.role.present ? data.role.value : this.role,
      timestamp: data.timestamp.present ? data.timestamp.value : this.timestamp,
      deviceId: data.deviceId.present ? data.deviceId.value : this.deviceId,
      details: data.details.present ? data.details.value : this.details,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ExpenseAuditEntry(')
          ..write('id: $id, ')
          ..write('expenseId: $expenseId, ')
          ..write('action: $action, ')
          ..write('performedBy: $performedBy, ')
          ..write('role: $role, ')
          ..write('timestamp: $timestamp, ')
          ..write('deviceId: $deviceId, ')
          ..write('details: $details, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, expenseId, action, performedBy, role,
      timestamp, deviceId, details, syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ExpenseAuditEntry &&
          other.id == this.id &&
          other.expenseId == this.expenseId &&
          other.action == this.action &&
          other.performedBy == this.performedBy &&
          other.role == this.role &&
          other.timestamp == this.timestamp &&
          other.deviceId == this.deviceId &&
          other.details == this.details &&
          other.syncStatus == this.syncStatus);
}

class ExpenseAuditTableCompanion extends UpdateCompanion<ExpenseAuditEntry> {
  final Value<String> id;
  final Value<String> expenseId;
  final Value<String> action;
  final Value<String> performedBy;
  final Value<String> role;
  final Value<String> timestamp;
  final Value<String?> deviceId;
  final Value<String?> details;
  final Value<int> syncStatus;
  final Value<int> rowid;
  const ExpenseAuditTableCompanion({
    this.id = const Value.absent(),
    this.expenseId = const Value.absent(),
    this.action = const Value.absent(),
    this.performedBy = const Value.absent(),
    this.role = const Value.absent(),
    this.timestamp = const Value.absent(),
    this.deviceId = const Value.absent(),
    this.details = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ExpenseAuditTableCompanion.insert({
    required String id,
    required String expenseId,
    required String action,
    required String performedBy,
    required String role,
    required String timestamp,
    this.deviceId = const Value.absent(),
    this.details = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        expenseId = Value(expenseId),
        action = Value(action),
        performedBy = Value(performedBy),
        role = Value(role),
        timestamp = Value(timestamp);
  static Insertable<ExpenseAuditEntry> custom({
    Expression<String>? id,
    Expression<String>? expenseId,
    Expression<String>? action,
    Expression<String>? performedBy,
    Expression<String>? role,
    Expression<String>? timestamp,
    Expression<String>? deviceId,
    Expression<String>? details,
    Expression<int>? syncStatus,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (expenseId != null) 'expense_id': expenseId,
      if (action != null) 'action': action,
      if (performedBy != null) 'performed_by': performedBy,
      if (role != null) 'role': role,
      if (timestamp != null) 'timestamp': timestamp,
      if (deviceId != null) 'device_id': deviceId,
      if (details != null) 'details': details,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ExpenseAuditTableCompanion copyWith(
      {Value<String>? id,
      Value<String>? expenseId,
      Value<String>? action,
      Value<String>? performedBy,
      Value<String>? role,
      Value<String>? timestamp,
      Value<String?>? deviceId,
      Value<String?>? details,
      Value<int>? syncStatus,
      Value<int>? rowid}) {
    return ExpenseAuditTableCompanion(
      id: id ?? this.id,
      expenseId: expenseId ?? this.expenseId,
      action: action ?? this.action,
      performedBy: performedBy ?? this.performedBy,
      role: role ?? this.role,
      timestamp: timestamp ?? this.timestamp,
      deviceId: deviceId ?? this.deviceId,
      details: details ?? this.details,
      syncStatus: syncStatus ?? this.syncStatus,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (expenseId.present) {
      map['expense_id'] = Variable<String>(expenseId.value);
    }
    if (action.present) {
      map['action'] = Variable<String>(action.value);
    }
    if (performedBy.present) {
      map['performed_by'] = Variable<String>(performedBy.value);
    }
    if (role.present) {
      map['role'] = Variable<String>(role.value);
    }
    if (timestamp.present) {
      map['timestamp'] = Variable<String>(timestamp.value);
    }
    if (deviceId.present) {
      map['device_id'] = Variable<String>(deviceId.value);
    }
    if (details.present) {
      map['details'] = Variable<String>(details.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ExpenseAuditTableCompanion(')
          ..write('id: $id, ')
          ..write('expenseId: $expenseId, ')
          ..write('action: $action, ')
          ..write('performedBy: $performedBy, ')
          ..write('role: $role, ')
          ..write('timestamp: $timestamp, ')
          ..write('deviceId: $deviceId, ')
          ..write('details: $details, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $ExpenseBillTableTable extends ExpenseBillTable
    with TableInfo<$ExpenseBillTableTable, ExpenseBillEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ExpenseBillTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _expenseIdMeta =
      const VerificationMeta('expenseId');
  @override
  late final GeneratedColumn<String> expenseId = GeneratedColumn<String>(
      'expense_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _filePathMeta =
      const VerificationMeta('filePath');
  @override
  late final GeneratedColumn<String> filePath = GeneratedColumn<String>(
      'file_path', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _fileNameMeta =
      const VerificationMeta('fileName');
  @override
  late final GeneratedColumn<String> fileName = GeneratedColumn<String>(
      'file_name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _fileTypeMeta =
      const VerificationMeta('fileType');
  @override
  late final GeneratedColumn<String> fileType = GeneratedColumn<String>(
      'file_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _fileSizeMeta =
      const VerificationMeta('fileSize');
  @override
  late final GeneratedColumn<int> fileSize = GeneratedColumn<int>(
      'file_size', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns =>
      [id, expenseId, filePath, fileName, fileType, fileSize, syncStatus];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'expense_bill_table';
  @override
  VerificationContext validateIntegrity(Insertable<ExpenseBillEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('expense_id')) {
      context.handle(_expenseIdMeta,
          expenseId.isAcceptableOrUnknown(data['expense_id']!, _expenseIdMeta));
    } else if (isInserting) {
      context.missing(_expenseIdMeta);
    }
    if (data.containsKey('file_path')) {
      context.handle(_filePathMeta,
          filePath.isAcceptableOrUnknown(data['file_path']!, _filePathMeta));
    } else if (isInserting) {
      context.missing(_filePathMeta);
    }
    if (data.containsKey('file_name')) {
      context.handle(_fileNameMeta,
          fileName.isAcceptableOrUnknown(data['file_name']!, _fileNameMeta));
    } else if (isInserting) {
      context.missing(_fileNameMeta);
    }
    if (data.containsKey('file_type')) {
      context.handle(_fileTypeMeta,
          fileType.isAcceptableOrUnknown(data['file_type']!, _fileTypeMeta));
    } else if (isInserting) {
      context.missing(_fileTypeMeta);
    }
    if (data.containsKey('file_size')) {
      context.handle(_fileSizeMeta,
          fileSize.isAcceptableOrUnknown(data['file_size']!, _fileSizeMeta));
    } else if (isInserting) {
      context.missing(_fileSizeMeta);
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  ExpenseBillEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ExpenseBillEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      expenseId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}expense_id'])!,
      filePath: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}file_path'])!,
      fileName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}file_name'])!,
      fileType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}file_type'])!,
      fileSize: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}file_size'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $ExpenseBillTableTable createAlias(String alias) {
    return $ExpenseBillTableTable(attachedDatabase, alias);
  }
}

class ExpenseBillEntry extends DataClass
    implements Insertable<ExpenseBillEntry> {
  final String id;
  final String expenseId;
  final String filePath;
  final String fileName;
  final String fileType;
  final int fileSize;
  final int syncStatus;
  const ExpenseBillEntry(
      {required this.id,
      required this.expenseId,
      required this.filePath,
      required this.fileName,
      required this.fileType,
      required this.fileSize,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['expense_id'] = Variable<String>(expenseId);
    map['file_path'] = Variable<String>(filePath);
    map['file_name'] = Variable<String>(fileName);
    map['file_type'] = Variable<String>(fileType);
    map['file_size'] = Variable<int>(fileSize);
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  ExpenseBillTableCompanion toCompanion(bool nullToAbsent) {
    return ExpenseBillTableCompanion(
      id: Value(id),
      expenseId: Value(expenseId),
      filePath: Value(filePath),
      fileName: Value(fileName),
      fileType: Value(fileType),
      fileSize: Value(fileSize),
      syncStatus: Value(syncStatus),
    );
  }

  factory ExpenseBillEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ExpenseBillEntry(
      id: serializer.fromJson<String>(json['id']),
      expenseId: serializer.fromJson<String>(json['expenseId']),
      filePath: serializer.fromJson<String>(json['filePath']),
      fileName: serializer.fromJson<String>(json['fileName']),
      fileType: serializer.fromJson<String>(json['fileType']),
      fileSize: serializer.fromJson<int>(json['fileSize']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'expenseId': serializer.toJson<String>(expenseId),
      'filePath': serializer.toJson<String>(filePath),
      'fileName': serializer.toJson<String>(fileName),
      'fileType': serializer.toJson<String>(fileType),
      'fileSize': serializer.toJson<int>(fileSize),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  ExpenseBillEntry copyWith(
          {String? id,
          String? expenseId,
          String? filePath,
          String? fileName,
          String? fileType,
          int? fileSize,
          int? syncStatus}) =>
      ExpenseBillEntry(
        id: id ?? this.id,
        expenseId: expenseId ?? this.expenseId,
        filePath: filePath ?? this.filePath,
        fileName: fileName ?? this.fileName,
        fileType: fileType ?? this.fileType,
        fileSize: fileSize ?? this.fileSize,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  ExpenseBillEntry copyWithCompanion(ExpenseBillTableCompanion data) {
    return ExpenseBillEntry(
      id: data.id.present ? data.id.value : this.id,
      expenseId: data.expenseId.present ? data.expenseId.value : this.expenseId,
      filePath: data.filePath.present ? data.filePath.value : this.filePath,
      fileName: data.fileName.present ? data.fileName.value : this.fileName,
      fileType: data.fileType.present ? data.fileType.value : this.fileType,
      fileSize: data.fileSize.present ? data.fileSize.value : this.fileSize,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ExpenseBillEntry(')
          ..write('id: $id, ')
          ..write('expenseId: $expenseId, ')
          ..write('filePath: $filePath, ')
          ..write('fileName: $fileName, ')
          ..write('fileType: $fileType, ')
          ..write('fileSize: $fileSize, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id, expenseId, filePath, fileName, fileType, fileSize, syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ExpenseBillEntry &&
          other.id == this.id &&
          other.expenseId == this.expenseId &&
          other.filePath == this.filePath &&
          other.fileName == this.fileName &&
          other.fileType == this.fileType &&
          other.fileSize == this.fileSize &&
          other.syncStatus == this.syncStatus);
}

class ExpenseBillTableCompanion extends UpdateCompanion<ExpenseBillEntry> {
  final Value<String> id;
  final Value<String> expenseId;
  final Value<String> filePath;
  final Value<String> fileName;
  final Value<String> fileType;
  final Value<int> fileSize;
  final Value<int> syncStatus;
  final Value<int> rowid;
  const ExpenseBillTableCompanion({
    this.id = const Value.absent(),
    this.expenseId = const Value.absent(),
    this.filePath = const Value.absent(),
    this.fileName = const Value.absent(),
    this.fileType = const Value.absent(),
    this.fileSize = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ExpenseBillTableCompanion.insert({
    required String id,
    required String expenseId,
    required String filePath,
    required String fileName,
    required String fileType,
    required int fileSize,
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        expenseId = Value(expenseId),
        filePath = Value(filePath),
        fileName = Value(fileName),
        fileType = Value(fileType),
        fileSize = Value(fileSize);
  static Insertable<ExpenseBillEntry> custom({
    Expression<String>? id,
    Expression<String>? expenseId,
    Expression<String>? filePath,
    Expression<String>? fileName,
    Expression<String>? fileType,
    Expression<int>? fileSize,
    Expression<int>? syncStatus,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (expenseId != null) 'expense_id': expenseId,
      if (filePath != null) 'file_path': filePath,
      if (fileName != null) 'file_name': fileName,
      if (fileType != null) 'file_type': fileType,
      if (fileSize != null) 'file_size': fileSize,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ExpenseBillTableCompanion copyWith(
      {Value<String>? id,
      Value<String>? expenseId,
      Value<String>? filePath,
      Value<String>? fileName,
      Value<String>? fileType,
      Value<int>? fileSize,
      Value<int>? syncStatus,
      Value<int>? rowid}) {
    return ExpenseBillTableCompanion(
      id: id ?? this.id,
      expenseId: expenseId ?? this.expenseId,
      filePath: filePath ?? this.filePath,
      fileName: fileName ?? this.fileName,
      fileType: fileType ?? this.fileType,
      fileSize: fileSize ?? this.fileSize,
      syncStatus: syncStatus ?? this.syncStatus,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (expenseId.present) {
      map['expense_id'] = Variable<String>(expenseId.value);
    }
    if (filePath.present) {
      map['file_path'] = Variable<String>(filePath.value);
    }
    if (fileName.present) {
      map['file_name'] = Variable<String>(fileName.value);
    }
    if (fileType.present) {
      map['file_type'] = Variable<String>(fileType.value);
    }
    if (fileSize.present) {
      map['file_size'] = Variable<int>(fileSize.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ExpenseBillTableCompanion(')
          ..write('id: $id, ')
          ..write('expenseId: $expenseId, ')
          ..write('filePath: $filePath, ')
          ..write('fileName: $fileName, ')
          ..write('fileType: $fileType, ')
          ..write('fileSize: $fileSize, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $ExpensePaymentTableTable extends ExpensePaymentTable
    with TableInfo<$ExpensePaymentTableTable, ExpensePaymentEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ExpensePaymentTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _expenseIdMeta =
      const VerificationMeta('expenseId');
  @override
  late final GeneratedColumn<String> expenseId = GeneratedColumn<String>(
      'expense_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _financeIdMeta =
      const VerificationMeta('financeId');
  @override
  late final GeneratedColumn<String> financeId = GeneratedColumn<String>(
      'finance_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _paymentDateMeta =
      const VerificationMeta('paymentDate');
  @override
  late final GeneratedColumn<String> paymentDate = GeneratedColumn<String>(
      'payment_date', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _paymentModeMeta =
      const VerificationMeta('paymentMode');
  @override
  late final GeneratedColumn<String> paymentMode = GeneratedColumn<String>(
      'payment_mode', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _transactionNumberMeta =
      const VerificationMeta('transactionNumber');
  @override
  late final GeneratedColumn<String> transactionNumber =
      GeneratedColumn<String>('transaction_number', aliasedName, true,
          type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _referenceNumberMeta =
      const VerificationMeta('referenceNumber');
  @override
  late final GeneratedColumn<String> referenceNumber = GeneratedColumn<String>(
      'reference_number', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
      'status', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns => [
        id,
        expenseId,
        financeId,
        paymentDate,
        paymentMode,
        transactionNumber,
        referenceNumber,
        status,
        syncStatus
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'expense_payment_table';
  @override
  VerificationContext validateIntegrity(
      Insertable<ExpensePaymentEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('expense_id')) {
      context.handle(_expenseIdMeta,
          expenseId.isAcceptableOrUnknown(data['expense_id']!, _expenseIdMeta));
    } else if (isInserting) {
      context.missing(_expenseIdMeta);
    }
    if (data.containsKey('finance_id')) {
      context.handle(_financeIdMeta,
          financeId.isAcceptableOrUnknown(data['finance_id']!, _financeIdMeta));
    } else if (isInserting) {
      context.missing(_financeIdMeta);
    }
    if (data.containsKey('payment_date')) {
      context.handle(
          _paymentDateMeta,
          paymentDate.isAcceptableOrUnknown(
              data['payment_date']!, _paymentDateMeta));
    } else if (isInserting) {
      context.missing(_paymentDateMeta);
    }
    if (data.containsKey('payment_mode')) {
      context.handle(
          _paymentModeMeta,
          paymentMode.isAcceptableOrUnknown(
              data['payment_mode']!, _paymentModeMeta));
    } else if (isInserting) {
      context.missing(_paymentModeMeta);
    }
    if (data.containsKey('transaction_number')) {
      context.handle(
          _transactionNumberMeta,
          transactionNumber.isAcceptableOrUnknown(
              data['transaction_number']!, _transactionNumberMeta));
    }
    if (data.containsKey('reference_number')) {
      context.handle(
          _referenceNumberMeta,
          referenceNumber.isAcceptableOrUnknown(
              data['reference_number']!, _referenceNumberMeta));
    }
    if (data.containsKey('status')) {
      context.handle(_statusMeta,
          status.isAcceptableOrUnknown(data['status']!, _statusMeta));
    } else if (isInserting) {
      context.missing(_statusMeta);
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  ExpensePaymentEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ExpensePaymentEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      expenseId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}expense_id'])!,
      financeId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}finance_id'])!,
      paymentDate: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}payment_date'])!,
      paymentMode: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}payment_mode'])!,
      transactionNumber: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}transaction_number']),
      referenceNumber: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}reference_number']),
      status: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}status'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $ExpensePaymentTableTable createAlias(String alias) {
    return $ExpensePaymentTableTable(attachedDatabase, alias);
  }
}

class ExpensePaymentEntry extends DataClass
    implements Insertable<ExpensePaymentEntry> {
  final String id;
  final String expenseId;
  final String financeId;
  final String paymentDate;
  final String paymentMode;
  final String? transactionNumber;
  final String? referenceNumber;
  final String status;
  final int syncStatus;
  const ExpensePaymentEntry(
      {required this.id,
      required this.expenseId,
      required this.financeId,
      required this.paymentDate,
      required this.paymentMode,
      this.transactionNumber,
      this.referenceNumber,
      required this.status,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['expense_id'] = Variable<String>(expenseId);
    map['finance_id'] = Variable<String>(financeId);
    map['payment_date'] = Variable<String>(paymentDate);
    map['payment_mode'] = Variable<String>(paymentMode);
    if (!nullToAbsent || transactionNumber != null) {
      map['transaction_number'] = Variable<String>(transactionNumber);
    }
    if (!nullToAbsent || referenceNumber != null) {
      map['reference_number'] = Variable<String>(referenceNumber);
    }
    map['status'] = Variable<String>(status);
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  ExpensePaymentTableCompanion toCompanion(bool nullToAbsent) {
    return ExpensePaymentTableCompanion(
      id: Value(id),
      expenseId: Value(expenseId),
      financeId: Value(financeId),
      paymentDate: Value(paymentDate),
      paymentMode: Value(paymentMode),
      transactionNumber: transactionNumber == null && nullToAbsent
          ? const Value.absent()
          : Value(transactionNumber),
      referenceNumber: referenceNumber == null && nullToAbsent
          ? const Value.absent()
          : Value(referenceNumber),
      status: Value(status),
      syncStatus: Value(syncStatus),
    );
  }

  factory ExpensePaymentEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ExpensePaymentEntry(
      id: serializer.fromJson<String>(json['id']),
      expenseId: serializer.fromJson<String>(json['expenseId']),
      financeId: serializer.fromJson<String>(json['financeId']),
      paymentDate: serializer.fromJson<String>(json['paymentDate']),
      paymentMode: serializer.fromJson<String>(json['paymentMode']),
      transactionNumber:
          serializer.fromJson<String?>(json['transactionNumber']),
      referenceNumber: serializer.fromJson<String?>(json['referenceNumber']),
      status: serializer.fromJson<String>(json['status']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'expenseId': serializer.toJson<String>(expenseId),
      'financeId': serializer.toJson<String>(financeId),
      'paymentDate': serializer.toJson<String>(paymentDate),
      'paymentMode': serializer.toJson<String>(paymentMode),
      'transactionNumber': serializer.toJson<String?>(transactionNumber),
      'referenceNumber': serializer.toJson<String?>(referenceNumber),
      'status': serializer.toJson<String>(status),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  ExpensePaymentEntry copyWith(
          {String? id,
          String? expenseId,
          String? financeId,
          String? paymentDate,
          String? paymentMode,
          Value<String?> transactionNumber = const Value.absent(),
          Value<String?> referenceNumber = const Value.absent(),
          String? status,
          int? syncStatus}) =>
      ExpensePaymentEntry(
        id: id ?? this.id,
        expenseId: expenseId ?? this.expenseId,
        financeId: financeId ?? this.financeId,
        paymentDate: paymentDate ?? this.paymentDate,
        paymentMode: paymentMode ?? this.paymentMode,
        transactionNumber: transactionNumber.present
            ? transactionNumber.value
            : this.transactionNumber,
        referenceNumber: referenceNumber.present
            ? referenceNumber.value
            : this.referenceNumber,
        status: status ?? this.status,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  ExpensePaymentEntry copyWithCompanion(ExpensePaymentTableCompanion data) {
    return ExpensePaymentEntry(
      id: data.id.present ? data.id.value : this.id,
      expenseId: data.expenseId.present ? data.expenseId.value : this.expenseId,
      financeId: data.financeId.present ? data.financeId.value : this.financeId,
      paymentDate:
          data.paymentDate.present ? data.paymentDate.value : this.paymentDate,
      paymentMode:
          data.paymentMode.present ? data.paymentMode.value : this.paymentMode,
      transactionNumber: data.transactionNumber.present
          ? data.transactionNumber.value
          : this.transactionNumber,
      referenceNumber: data.referenceNumber.present
          ? data.referenceNumber.value
          : this.referenceNumber,
      status: data.status.present ? data.status.value : this.status,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ExpensePaymentEntry(')
          ..write('id: $id, ')
          ..write('expenseId: $expenseId, ')
          ..write('financeId: $financeId, ')
          ..write('paymentDate: $paymentDate, ')
          ..write('paymentMode: $paymentMode, ')
          ..write('transactionNumber: $transactionNumber, ')
          ..write('referenceNumber: $referenceNumber, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, expenseId, financeId, paymentDate,
      paymentMode, transactionNumber, referenceNumber, status, syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ExpensePaymentEntry &&
          other.id == this.id &&
          other.expenseId == this.expenseId &&
          other.financeId == this.financeId &&
          other.paymentDate == this.paymentDate &&
          other.paymentMode == this.paymentMode &&
          other.transactionNumber == this.transactionNumber &&
          other.referenceNumber == this.referenceNumber &&
          other.status == this.status &&
          other.syncStatus == this.syncStatus);
}

class ExpensePaymentTableCompanion
    extends UpdateCompanion<ExpensePaymentEntry> {
  final Value<String> id;
  final Value<String> expenseId;
  final Value<String> financeId;
  final Value<String> paymentDate;
  final Value<String> paymentMode;
  final Value<String?> transactionNumber;
  final Value<String?> referenceNumber;
  final Value<String> status;
  final Value<int> syncStatus;
  final Value<int> rowid;
  const ExpensePaymentTableCompanion({
    this.id = const Value.absent(),
    this.expenseId = const Value.absent(),
    this.financeId = const Value.absent(),
    this.paymentDate = const Value.absent(),
    this.paymentMode = const Value.absent(),
    this.transactionNumber = const Value.absent(),
    this.referenceNumber = const Value.absent(),
    this.status = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ExpensePaymentTableCompanion.insert({
    required String id,
    required String expenseId,
    required String financeId,
    required String paymentDate,
    required String paymentMode,
    this.transactionNumber = const Value.absent(),
    this.referenceNumber = const Value.absent(),
    required String status,
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        expenseId = Value(expenseId),
        financeId = Value(financeId),
        paymentDate = Value(paymentDate),
        paymentMode = Value(paymentMode),
        status = Value(status);
  static Insertable<ExpensePaymentEntry> custom({
    Expression<String>? id,
    Expression<String>? expenseId,
    Expression<String>? financeId,
    Expression<String>? paymentDate,
    Expression<String>? paymentMode,
    Expression<String>? transactionNumber,
    Expression<String>? referenceNumber,
    Expression<String>? status,
    Expression<int>? syncStatus,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (expenseId != null) 'expense_id': expenseId,
      if (financeId != null) 'finance_id': financeId,
      if (paymentDate != null) 'payment_date': paymentDate,
      if (paymentMode != null) 'payment_mode': paymentMode,
      if (transactionNumber != null) 'transaction_number': transactionNumber,
      if (referenceNumber != null) 'reference_number': referenceNumber,
      if (status != null) 'status': status,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ExpensePaymentTableCompanion copyWith(
      {Value<String>? id,
      Value<String>? expenseId,
      Value<String>? financeId,
      Value<String>? paymentDate,
      Value<String>? paymentMode,
      Value<String?>? transactionNumber,
      Value<String?>? referenceNumber,
      Value<String>? status,
      Value<int>? syncStatus,
      Value<int>? rowid}) {
    return ExpensePaymentTableCompanion(
      id: id ?? this.id,
      expenseId: expenseId ?? this.expenseId,
      financeId: financeId ?? this.financeId,
      paymentDate: paymentDate ?? this.paymentDate,
      paymentMode: paymentMode ?? this.paymentMode,
      transactionNumber: transactionNumber ?? this.transactionNumber,
      referenceNumber: referenceNumber ?? this.referenceNumber,
      status: status ?? this.status,
      syncStatus: syncStatus ?? this.syncStatus,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (expenseId.present) {
      map['expense_id'] = Variable<String>(expenseId.value);
    }
    if (financeId.present) {
      map['finance_id'] = Variable<String>(financeId.value);
    }
    if (paymentDate.present) {
      map['payment_date'] = Variable<String>(paymentDate.value);
    }
    if (paymentMode.present) {
      map['payment_mode'] = Variable<String>(paymentMode.value);
    }
    if (transactionNumber.present) {
      map['transaction_number'] = Variable<String>(transactionNumber.value);
    }
    if (referenceNumber.present) {
      map['reference_number'] = Variable<String>(referenceNumber.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ExpensePaymentTableCompanion(')
          ..write('id: $id, ')
          ..write('expenseId: $expenseId, ')
          ..write('financeId: $financeId, ')
          ..write('paymentDate: $paymentDate, ')
          ..write('paymentMode: $paymentMode, ')
          ..write('transactionNumber: $transactionNumber, ')
          ..write('referenceNumber: $referenceNumber, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $ExpenseTableTable extends ExpenseTable
    with TableInfo<$ExpenseTableTable, ExpenseEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ExpenseTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<DateTime> date = GeneratedColumn<DateTime>(
      'date', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _locationTypeMeta =
      const VerificationMeta('locationType');
  @override
  late final GeneratedColumn<String> locationType = GeneratedColumn<String>(
      'location_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _daAmountMeta =
      const VerificationMeta('daAmount');
  @override
  late final GeneratedColumn<double> daAmount = GeneratedColumn<double>(
      'da_amount', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0.0));
  static const VerificationMeta _taTypeMeta = const VerificationMeta('taType');
  @override
  late final GeneratedColumn<String> taType = GeneratedColumn<String>(
      'ta_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _taDistanceMeta =
      const VerificationMeta('taDistance');
  @override
  late final GeneratedColumn<double> taDistance = GeneratedColumn<double>(
      'ta_distance', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0.0));
  static const VerificationMeta _taRateMeta = const VerificationMeta('taRate');
  @override
  late final GeneratedColumn<double> taRate = GeneratedColumn<double>(
      'ta_rate', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0.0));
  static const VerificationMeta _taAmountMeta =
      const VerificationMeta('taAmount');
  @override
  late final GeneratedColumn<double> taAmount = GeneratedColumn<double>(
      'ta_amount', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0.0));
  static const VerificationMeta _miscTotalMeta =
      const VerificationMeta('miscTotal');
  @override
  late final GeneratedColumn<double> miscTotal = GeneratedColumn<double>(
      'misc_total', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0.0));
  static const VerificationMeta _grandTotalMeta =
      const VerificationMeta('grandTotal');
  @override
  late final GeneratedColumn<double> grandTotal = GeneratedColumn<double>(
      'grand_total', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0.0));
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
      'status', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('Draft'));
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns => [
        id,
        date,
        locationType,
        daAmount,
        taType,
        taDistance,
        taRate,
        taAmount,
        miscTotal,
        grandTotal,
        status,
        syncStatus
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'expense_table';
  @override
  VerificationContext validateIntegrity(Insertable<ExpenseEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
          _dateMeta, date.isAcceptableOrUnknown(data['date']!, _dateMeta));
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('location_type')) {
      context.handle(
          _locationTypeMeta,
          locationType.isAcceptableOrUnknown(
              data['location_type']!, _locationTypeMeta));
    } else if (isInserting) {
      context.missing(_locationTypeMeta);
    }
    if (data.containsKey('da_amount')) {
      context.handle(_daAmountMeta,
          daAmount.isAcceptableOrUnknown(data['da_amount']!, _daAmountMeta));
    }
    if (data.containsKey('ta_type')) {
      context.handle(_taTypeMeta,
          taType.isAcceptableOrUnknown(data['ta_type']!, _taTypeMeta));
    } else if (isInserting) {
      context.missing(_taTypeMeta);
    }
    if (data.containsKey('ta_distance')) {
      context.handle(
          _taDistanceMeta,
          taDistance.isAcceptableOrUnknown(
              data['ta_distance']!, _taDistanceMeta));
    }
    if (data.containsKey('ta_rate')) {
      context.handle(_taRateMeta,
          taRate.isAcceptableOrUnknown(data['ta_rate']!, _taRateMeta));
    }
    if (data.containsKey('ta_amount')) {
      context.handle(_taAmountMeta,
          taAmount.isAcceptableOrUnknown(data['ta_amount']!, _taAmountMeta));
    }
    if (data.containsKey('misc_total')) {
      context.handle(_miscTotalMeta,
          miscTotal.isAcceptableOrUnknown(data['misc_total']!, _miscTotalMeta));
    }
    if (data.containsKey('grand_total')) {
      context.handle(
          _grandTotalMeta,
          grandTotal.isAcceptableOrUnknown(
              data['grand_total']!, _grandTotalMeta));
    }
    if (data.containsKey('status')) {
      context.handle(_statusMeta,
          status.isAcceptableOrUnknown(data['status']!, _statusMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  ExpenseEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ExpenseEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      date: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}date'])!,
      locationType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}location_type'])!,
      daAmount: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}da_amount'])!,
      taType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}ta_type'])!,
      taDistance: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}ta_distance'])!,
      taRate: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}ta_rate'])!,
      taAmount: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}ta_amount'])!,
      miscTotal: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}misc_total'])!,
      grandTotal: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}grand_total'])!,
      status: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}status'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $ExpenseTableTable createAlias(String alias) {
    return $ExpenseTableTable(attachedDatabase, alias);
  }
}

class ExpenseEntry extends DataClass implements Insertable<ExpenseEntry> {
  final String id;
  final DateTime date;
  final String locationType;
  final double daAmount;
  final String taType;
  final double taDistance;
  final double taRate;
  final double taAmount;
  final double miscTotal;
  final double grandTotal;
  final String status;
  final int syncStatus;
  const ExpenseEntry(
      {required this.id,
      required this.date,
      required this.locationType,
      required this.daAmount,
      required this.taType,
      required this.taDistance,
      required this.taRate,
      required this.taAmount,
      required this.miscTotal,
      required this.grandTotal,
      required this.status,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['date'] = Variable<DateTime>(date);
    map['location_type'] = Variable<String>(locationType);
    map['da_amount'] = Variable<double>(daAmount);
    map['ta_type'] = Variable<String>(taType);
    map['ta_distance'] = Variable<double>(taDistance);
    map['ta_rate'] = Variable<double>(taRate);
    map['ta_amount'] = Variable<double>(taAmount);
    map['misc_total'] = Variable<double>(miscTotal);
    map['grand_total'] = Variable<double>(grandTotal);
    map['status'] = Variable<String>(status);
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  ExpenseTableCompanion toCompanion(bool nullToAbsent) {
    return ExpenseTableCompanion(
      id: Value(id),
      date: Value(date),
      locationType: Value(locationType),
      daAmount: Value(daAmount),
      taType: Value(taType),
      taDistance: Value(taDistance),
      taRate: Value(taRate),
      taAmount: Value(taAmount),
      miscTotal: Value(miscTotal),
      grandTotal: Value(grandTotal),
      status: Value(status),
      syncStatus: Value(syncStatus),
    );
  }

  factory ExpenseEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ExpenseEntry(
      id: serializer.fromJson<String>(json['id']),
      date: serializer.fromJson<DateTime>(json['date']),
      locationType: serializer.fromJson<String>(json['locationType']),
      daAmount: serializer.fromJson<double>(json['daAmount']),
      taType: serializer.fromJson<String>(json['taType']),
      taDistance: serializer.fromJson<double>(json['taDistance']),
      taRate: serializer.fromJson<double>(json['taRate']),
      taAmount: serializer.fromJson<double>(json['taAmount']),
      miscTotal: serializer.fromJson<double>(json['miscTotal']),
      grandTotal: serializer.fromJson<double>(json['grandTotal']),
      status: serializer.fromJson<String>(json['status']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'date': serializer.toJson<DateTime>(date),
      'locationType': serializer.toJson<String>(locationType),
      'daAmount': serializer.toJson<double>(daAmount),
      'taType': serializer.toJson<String>(taType),
      'taDistance': serializer.toJson<double>(taDistance),
      'taRate': serializer.toJson<double>(taRate),
      'taAmount': serializer.toJson<double>(taAmount),
      'miscTotal': serializer.toJson<double>(miscTotal),
      'grandTotal': serializer.toJson<double>(grandTotal),
      'status': serializer.toJson<String>(status),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  ExpenseEntry copyWith(
          {String? id,
          DateTime? date,
          String? locationType,
          double? daAmount,
          String? taType,
          double? taDistance,
          double? taRate,
          double? taAmount,
          double? miscTotal,
          double? grandTotal,
          String? status,
          int? syncStatus}) =>
      ExpenseEntry(
        id: id ?? this.id,
        date: date ?? this.date,
        locationType: locationType ?? this.locationType,
        daAmount: daAmount ?? this.daAmount,
        taType: taType ?? this.taType,
        taDistance: taDistance ?? this.taDistance,
        taRate: taRate ?? this.taRate,
        taAmount: taAmount ?? this.taAmount,
        miscTotal: miscTotal ?? this.miscTotal,
        grandTotal: grandTotal ?? this.grandTotal,
        status: status ?? this.status,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  ExpenseEntry copyWithCompanion(ExpenseTableCompanion data) {
    return ExpenseEntry(
      id: data.id.present ? data.id.value : this.id,
      date: data.date.present ? data.date.value : this.date,
      locationType: data.locationType.present
          ? data.locationType.value
          : this.locationType,
      daAmount: data.daAmount.present ? data.daAmount.value : this.daAmount,
      taType: data.taType.present ? data.taType.value : this.taType,
      taDistance:
          data.taDistance.present ? data.taDistance.value : this.taDistance,
      taRate: data.taRate.present ? data.taRate.value : this.taRate,
      taAmount: data.taAmount.present ? data.taAmount.value : this.taAmount,
      miscTotal: data.miscTotal.present ? data.miscTotal.value : this.miscTotal,
      grandTotal:
          data.grandTotal.present ? data.grandTotal.value : this.grandTotal,
      status: data.status.present ? data.status.value : this.status,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ExpenseEntry(')
          ..write('id: $id, ')
          ..write('date: $date, ')
          ..write('locationType: $locationType, ')
          ..write('daAmount: $daAmount, ')
          ..write('taType: $taType, ')
          ..write('taDistance: $taDistance, ')
          ..write('taRate: $taRate, ')
          ..write('taAmount: $taAmount, ')
          ..write('miscTotal: $miscTotal, ')
          ..write('grandTotal: $grandTotal, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, date, locationType, daAmount, taType,
      taDistance, taRate, taAmount, miscTotal, grandTotal, status, syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ExpenseEntry &&
          other.id == this.id &&
          other.date == this.date &&
          other.locationType == this.locationType &&
          other.daAmount == this.daAmount &&
          other.taType == this.taType &&
          other.taDistance == this.taDistance &&
          other.taRate == this.taRate &&
          other.taAmount == this.taAmount &&
          other.miscTotal == this.miscTotal &&
          other.grandTotal == this.grandTotal &&
          other.status == this.status &&
          other.syncStatus == this.syncStatus);
}

class ExpenseTableCompanion extends UpdateCompanion<ExpenseEntry> {
  final Value<String> id;
  final Value<DateTime> date;
  final Value<String> locationType;
  final Value<double> daAmount;
  final Value<String> taType;
  final Value<double> taDistance;
  final Value<double> taRate;
  final Value<double> taAmount;
  final Value<double> miscTotal;
  final Value<double> grandTotal;
  final Value<String> status;
  final Value<int> syncStatus;
  final Value<int> rowid;
  const ExpenseTableCompanion({
    this.id = const Value.absent(),
    this.date = const Value.absent(),
    this.locationType = const Value.absent(),
    this.daAmount = const Value.absent(),
    this.taType = const Value.absent(),
    this.taDistance = const Value.absent(),
    this.taRate = const Value.absent(),
    this.taAmount = const Value.absent(),
    this.miscTotal = const Value.absent(),
    this.grandTotal = const Value.absent(),
    this.status = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ExpenseTableCompanion.insert({
    required String id,
    required DateTime date,
    required String locationType,
    this.daAmount = const Value.absent(),
    required String taType,
    this.taDistance = const Value.absent(),
    this.taRate = const Value.absent(),
    this.taAmount = const Value.absent(),
    this.miscTotal = const Value.absent(),
    this.grandTotal = const Value.absent(),
    this.status = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        date = Value(date),
        locationType = Value(locationType),
        taType = Value(taType);
  static Insertable<ExpenseEntry> custom({
    Expression<String>? id,
    Expression<DateTime>? date,
    Expression<String>? locationType,
    Expression<double>? daAmount,
    Expression<String>? taType,
    Expression<double>? taDistance,
    Expression<double>? taRate,
    Expression<double>? taAmount,
    Expression<double>? miscTotal,
    Expression<double>? grandTotal,
    Expression<String>? status,
    Expression<int>? syncStatus,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (date != null) 'date': date,
      if (locationType != null) 'location_type': locationType,
      if (daAmount != null) 'da_amount': daAmount,
      if (taType != null) 'ta_type': taType,
      if (taDistance != null) 'ta_distance': taDistance,
      if (taRate != null) 'ta_rate': taRate,
      if (taAmount != null) 'ta_amount': taAmount,
      if (miscTotal != null) 'misc_total': miscTotal,
      if (grandTotal != null) 'grand_total': grandTotal,
      if (status != null) 'status': status,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ExpenseTableCompanion copyWith(
      {Value<String>? id,
      Value<DateTime>? date,
      Value<String>? locationType,
      Value<double>? daAmount,
      Value<String>? taType,
      Value<double>? taDistance,
      Value<double>? taRate,
      Value<double>? taAmount,
      Value<double>? miscTotal,
      Value<double>? grandTotal,
      Value<String>? status,
      Value<int>? syncStatus,
      Value<int>? rowid}) {
    return ExpenseTableCompanion(
      id: id ?? this.id,
      date: date ?? this.date,
      locationType: locationType ?? this.locationType,
      daAmount: daAmount ?? this.daAmount,
      taType: taType ?? this.taType,
      taDistance: taDistance ?? this.taDistance,
      taRate: taRate ?? this.taRate,
      taAmount: taAmount ?? this.taAmount,
      miscTotal: miscTotal ?? this.miscTotal,
      grandTotal: grandTotal ?? this.grandTotal,
      status: status ?? this.status,
      syncStatus: syncStatus ?? this.syncStatus,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (date.present) {
      map['date'] = Variable<DateTime>(date.value);
    }
    if (locationType.present) {
      map['location_type'] = Variable<String>(locationType.value);
    }
    if (daAmount.present) {
      map['da_amount'] = Variable<double>(daAmount.value);
    }
    if (taType.present) {
      map['ta_type'] = Variable<String>(taType.value);
    }
    if (taDistance.present) {
      map['ta_distance'] = Variable<double>(taDistance.value);
    }
    if (taRate.present) {
      map['ta_rate'] = Variable<double>(taRate.value);
    }
    if (taAmount.present) {
      map['ta_amount'] = Variable<double>(taAmount.value);
    }
    if (miscTotal.present) {
      map['misc_total'] = Variable<double>(miscTotal.value);
    }
    if (grandTotal.present) {
      map['grand_total'] = Variable<double>(grandTotal.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ExpenseTableCompanion(')
          ..write('id: $id, ')
          ..write('date: $date, ')
          ..write('locationType: $locationType, ')
          ..write('daAmount: $daAmount, ')
          ..write('taType: $taType, ')
          ..write('taDistance: $taDistance, ')
          ..write('taRate: $taRate, ')
          ..write('taAmount: $taAmount, ')
          ..write('miscTotal: $miscTotal, ')
          ..write('grandTotal: $grandTotal, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $GpsLogTableTable extends GpsLogTable
    with TableInfo<$GpsLogTableTable, GpsLogEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $GpsLogTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _eventNameMeta =
      const VerificationMeta('eventName');
  @override
  late final GeneratedColumn<String> eventName = GeneratedColumn<String>(
      'event_name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _latitudeMeta =
      const VerificationMeta('latitude');
  @override
  late final GeneratedColumn<double> latitude = GeneratedColumn<double>(
      'latitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _longitudeMeta =
      const VerificationMeta('longitude');
  @override
  late final GeneratedColumn<double> longitude = GeneratedColumn<double>(
      'longitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _accuracyMeta =
      const VerificationMeta('accuracy');
  @override
  late final GeneratedColumn<double> accuracy = GeneratedColumn<double>(
      'accuracy', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _timestampMeta =
      const VerificationMeta('timestamp');
  @override
  late final GeneratedColumn<DateTime> timestamp = GeneratedColumn<DateTime>(
      'timestamp', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _deviceIdMeta =
      const VerificationMeta('deviceId');
  @override
  late final GeneratedColumn<String> deviceId = GeneratedColumn<String>(
      'device_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        eventName,
        latitude,
        longitude,
        accuracy,
        timestamp,
        deviceId,
        syncStatus,
        createdAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'gps_log_table';
  @override
  VerificationContext validateIntegrity(Insertable<GpsLogEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('event_name')) {
      context.handle(_eventNameMeta,
          eventName.isAcceptableOrUnknown(data['event_name']!, _eventNameMeta));
    } else if (isInserting) {
      context.missing(_eventNameMeta);
    }
    if (data.containsKey('latitude')) {
      context.handle(_latitudeMeta,
          latitude.isAcceptableOrUnknown(data['latitude']!, _latitudeMeta));
    } else if (isInserting) {
      context.missing(_latitudeMeta);
    }
    if (data.containsKey('longitude')) {
      context.handle(_longitudeMeta,
          longitude.isAcceptableOrUnknown(data['longitude']!, _longitudeMeta));
    } else if (isInserting) {
      context.missing(_longitudeMeta);
    }
    if (data.containsKey('accuracy')) {
      context.handle(_accuracyMeta,
          accuracy.isAcceptableOrUnknown(data['accuracy']!, _accuracyMeta));
    } else if (isInserting) {
      context.missing(_accuracyMeta);
    }
    if (data.containsKey('timestamp')) {
      context.handle(_timestampMeta,
          timestamp.isAcceptableOrUnknown(data['timestamp']!, _timestampMeta));
    } else if (isInserting) {
      context.missing(_timestampMeta);
    }
    if (data.containsKey('device_id')) {
      context.handle(_deviceIdMeta,
          deviceId.isAcceptableOrUnknown(data['device_id']!, _deviceIdMeta));
    } else if (isInserting) {
      context.missing(_deviceIdMeta);
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  GpsLogEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return GpsLogEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      eventName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}event_name'])!,
      latitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}latitude'])!,
      longitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}longitude'])!,
      accuracy: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}accuracy'])!,
      timestamp: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}timestamp'])!,
      deviceId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}device_id'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  $GpsLogTableTable createAlias(String alias) {
    return $GpsLogTableTable(attachedDatabase, alias);
  }
}

class GpsLogEntry extends DataClass implements Insertable<GpsLogEntry> {
  final int id;
  final String eventName;
  final double latitude;
  final double longitude;
  final double accuracy;
  final DateTime timestamp;
  final String deviceId;
  final int syncStatus;
  final DateTime createdAt;
  const GpsLogEntry(
      {required this.id,
      required this.eventName,
      required this.latitude,
      required this.longitude,
      required this.accuracy,
      required this.timestamp,
      required this.deviceId,
      required this.syncStatus,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['event_name'] = Variable<String>(eventName);
    map['latitude'] = Variable<double>(latitude);
    map['longitude'] = Variable<double>(longitude);
    map['accuracy'] = Variable<double>(accuracy);
    map['timestamp'] = Variable<DateTime>(timestamp);
    map['device_id'] = Variable<String>(deviceId);
    map['sync_status'] = Variable<int>(syncStatus);
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  GpsLogTableCompanion toCompanion(bool nullToAbsent) {
    return GpsLogTableCompanion(
      id: Value(id),
      eventName: Value(eventName),
      latitude: Value(latitude),
      longitude: Value(longitude),
      accuracy: Value(accuracy),
      timestamp: Value(timestamp),
      deviceId: Value(deviceId),
      syncStatus: Value(syncStatus),
      createdAt: Value(createdAt),
    );
  }

  factory GpsLogEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return GpsLogEntry(
      id: serializer.fromJson<int>(json['id']),
      eventName: serializer.fromJson<String>(json['eventName']),
      latitude: serializer.fromJson<double>(json['latitude']),
      longitude: serializer.fromJson<double>(json['longitude']),
      accuracy: serializer.fromJson<double>(json['accuracy']),
      timestamp: serializer.fromJson<DateTime>(json['timestamp']),
      deviceId: serializer.fromJson<String>(json['deviceId']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'eventName': serializer.toJson<String>(eventName),
      'latitude': serializer.toJson<double>(latitude),
      'longitude': serializer.toJson<double>(longitude),
      'accuracy': serializer.toJson<double>(accuracy),
      'timestamp': serializer.toJson<DateTime>(timestamp),
      'deviceId': serializer.toJson<String>(deviceId),
      'syncStatus': serializer.toJson<int>(syncStatus),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  GpsLogEntry copyWith(
          {int? id,
          String? eventName,
          double? latitude,
          double? longitude,
          double? accuracy,
          DateTime? timestamp,
          String? deviceId,
          int? syncStatus,
          DateTime? createdAt}) =>
      GpsLogEntry(
        id: id ?? this.id,
        eventName: eventName ?? this.eventName,
        latitude: latitude ?? this.latitude,
        longitude: longitude ?? this.longitude,
        accuracy: accuracy ?? this.accuracy,
        timestamp: timestamp ?? this.timestamp,
        deviceId: deviceId ?? this.deviceId,
        syncStatus: syncStatus ?? this.syncStatus,
        createdAt: createdAt ?? this.createdAt,
      );
  GpsLogEntry copyWithCompanion(GpsLogTableCompanion data) {
    return GpsLogEntry(
      id: data.id.present ? data.id.value : this.id,
      eventName: data.eventName.present ? data.eventName.value : this.eventName,
      latitude: data.latitude.present ? data.latitude.value : this.latitude,
      longitude: data.longitude.present ? data.longitude.value : this.longitude,
      accuracy: data.accuracy.present ? data.accuracy.value : this.accuracy,
      timestamp: data.timestamp.present ? data.timestamp.value : this.timestamp,
      deviceId: data.deviceId.present ? data.deviceId.value : this.deviceId,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('GpsLogEntry(')
          ..write('id: $id, ')
          ..write('eventName: $eventName, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('accuracy: $accuracy, ')
          ..write('timestamp: $timestamp, ')
          ..write('deviceId: $deviceId, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, eventName, latitude, longitude, accuracy,
      timestamp, deviceId, syncStatus, createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is GpsLogEntry &&
          other.id == this.id &&
          other.eventName == this.eventName &&
          other.latitude == this.latitude &&
          other.longitude == this.longitude &&
          other.accuracy == this.accuracy &&
          other.timestamp == this.timestamp &&
          other.deviceId == this.deviceId &&
          other.syncStatus == this.syncStatus &&
          other.createdAt == this.createdAt);
}

class GpsLogTableCompanion extends UpdateCompanion<GpsLogEntry> {
  final Value<int> id;
  final Value<String> eventName;
  final Value<double> latitude;
  final Value<double> longitude;
  final Value<double> accuracy;
  final Value<DateTime> timestamp;
  final Value<String> deviceId;
  final Value<int> syncStatus;
  final Value<DateTime> createdAt;
  const GpsLogTableCompanion({
    this.id = const Value.absent(),
    this.eventName = const Value.absent(),
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.accuracy = const Value.absent(),
    this.timestamp = const Value.absent(),
    this.deviceId = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  });
  GpsLogTableCompanion.insert({
    this.id = const Value.absent(),
    required String eventName,
    required double latitude,
    required double longitude,
    required double accuracy,
    required DateTime timestamp,
    required String deviceId,
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  })  : eventName = Value(eventName),
        latitude = Value(latitude),
        longitude = Value(longitude),
        accuracy = Value(accuracy),
        timestamp = Value(timestamp),
        deviceId = Value(deviceId);
  static Insertable<GpsLogEntry> custom({
    Expression<int>? id,
    Expression<String>? eventName,
    Expression<double>? latitude,
    Expression<double>? longitude,
    Expression<double>? accuracy,
    Expression<DateTime>? timestamp,
    Expression<String>? deviceId,
    Expression<int>? syncStatus,
    Expression<DateTime>? createdAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (eventName != null) 'event_name': eventName,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (accuracy != null) 'accuracy': accuracy,
      if (timestamp != null) 'timestamp': timestamp,
      if (deviceId != null) 'device_id': deviceId,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (createdAt != null) 'created_at': createdAt,
    });
  }

  GpsLogTableCompanion copyWith(
      {Value<int>? id,
      Value<String>? eventName,
      Value<double>? latitude,
      Value<double>? longitude,
      Value<double>? accuracy,
      Value<DateTime>? timestamp,
      Value<String>? deviceId,
      Value<int>? syncStatus,
      Value<DateTime>? createdAt}) {
    return GpsLogTableCompanion(
      id: id ?? this.id,
      eventName: eventName ?? this.eventName,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      accuracy: accuracy ?? this.accuracy,
      timestamp: timestamp ?? this.timestamp,
      deviceId: deviceId ?? this.deviceId,
      syncStatus: syncStatus ?? this.syncStatus,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (eventName.present) {
      map['event_name'] = Variable<String>(eventName.value);
    }
    if (latitude.present) {
      map['latitude'] = Variable<double>(latitude.value);
    }
    if (longitude.present) {
      map['longitude'] = Variable<double>(longitude.value);
    }
    if (accuracy.present) {
      map['accuracy'] = Variable<double>(accuracy.value);
    }
    if (timestamp.present) {
      map['timestamp'] = Variable<DateTime>(timestamp.value);
    }
    if (deviceId.present) {
      map['device_id'] = Variable<String>(deviceId.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('GpsLogTableCompanion(')
          ..write('id: $id, ')
          ..write('eventName: $eventName, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('accuracy: $accuracy, ')
          ..write('timestamp: $timestamp, ')
          ..write('deviceId: $deviceId, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }
}

class $HolidayTableTable extends HolidayTable
    with TableInfo<$HolidayTableTable, HolidayEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $HolidayTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<DateTime> date = GeneratedColumn<DateTime>(
      'date', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
      'name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _typeMeta = const VerificationMeta('type');
  @override
  late final GeneratedColumn<String> type = GeneratedColumn<String>(
      'type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _regionIdMeta =
      const VerificationMeta('regionId');
  @override
  late final GeneratedColumn<String> regionId = GeneratedColumn<String>(
      'region_id', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  @override
  List<GeneratedColumn> get $columns => [id, date, name, type, regionId];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'holiday_table';
  @override
  VerificationContext validateIntegrity(Insertable<HolidayEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('date')) {
      context.handle(
          _dateMeta, date.isAcceptableOrUnknown(data['date']!, _dateMeta));
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
          _nameMeta, name.isAcceptableOrUnknown(data['name']!, _nameMeta));
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('type')) {
      context.handle(
          _typeMeta, type.isAcceptableOrUnknown(data['type']!, _typeMeta));
    } else if (isInserting) {
      context.missing(_typeMeta);
    }
    if (data.containsKey('region_id')) {
      context.handle(_regionIdMeta,
          regionId.isAcceptableOrUnknown(data['region_id']!, _regionIdMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  HolidayEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return HolidayEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      date: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}date'])!,
      name: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}name'])!,
      type: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}type'])!,
      regionId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}region_id']),
    );
  }

  @override
  $HolidayTableTable createAlias(String alias) {
    return $HolidayTableTable(attachedDatabase, alias);
  }
}

class HolidayEntry extends DataClass implements Insertable<HolidayEntry> {
  final int id;
  final DateTime date;
  final String name;
  final String type;
  final String? regionId;
  const HolidayEntry(
      {required this.id,
      required this.date,
      required this.name,
      required this.type,
      this.regionId});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['date'] = Variable<DateTime>(date);
    map['name'] = Variable<String>(name);
    map['type'] = Variable<String>(type);
    if (!nullToAbsent || regionId != null) {
      map['region_id'] = Variable<String>(regionId);
    }
    return map;
  }

  HolidayTableCompanion toCompanion(bool nullToAbsent) {
    return HolidayTableCompanion(
      id: Value(id),
      date: Value(date),
      name: Value(name),
      type: Value(type),
      regionId: regionId == null && nullToAbsent
          ? const Value.absent()
          : Value(regionId),
    );
  }

  factory HolidayEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return HolidayEntry(
      id: serializer.fromJson<int>(json['id']),
      date: serializer.fromJson<DateTime>(json['date']),
      name: serializer.fromJson<String>(json['name']),
      type: serializer.fromJson<String>(json['type']),
      regionId: serializer.fromJson<String?>(json['regionId']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'date': serializer.toJson<DateTime>(date),
      'name': serializer.toJson<String>(name),
      'type': serializer.toJson<String>(type),
      'regionId': serializer.toJson<String?>(regionId),
    };
  }

  HolidayEntry copyWith(
          {int? id,
          DateTime? date,
          String? name,
          String? type,
          Value<String?> regionId = const Value.absent()}) =>
      HolidayEntry(
        id: id ?? this.id,
        date: date ?? this.date,
        name: name ?? this.name,
        type: type ?? this.type,
        regionId: regionId.present ? regionId.value : this.regionId,
      );
  HolidayEntry copyWithCompanion(HolidayTableCompanion data) {
    return HolidayEntry(
      id: data.id.present ? data.id.value : this.id,
      date: data.date.present ? data.date.value : this.date,
      name: data.name.present ? data.name.value : this.name,
      type: data.type.present ? data.type.value : this.type,
      regionId: data.regionId.present ? data.regionId.value : this.regionId,
    );
  }

  @override
  String toString() {
    return (StringBuffer('HolidayEntry(')
          ..write('id: $id, ')
          ..write('date: $date, ')
          ..write('name: $name, ')
          ..write('type: $type, ')
          ..write('regionId: $regionId')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, date, name, type, regionId);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is HolidayEntry &&
          other.id == this.id &&
          other.date == this.date &&
          other.name == this.name &&
          other.type == this.type &&
          other.regionId == this.regionId);
}

class HolidayTableCompanion extends UpdateCompanion<HolidayEntry> {
  final Value<int> id;
  final Value<DateTime> date;
  final Value<String> name;
  final Value<String> type;
  final Value<String?> regionId;
  const HolidayTableCompanion({
    this.id = const Value.absent(),
    this.date = const Value.absent(),
    this.name = const Value.absent(),
    this.type = const Value.absent(),
    this.regionId = const Value.absent(),
  });
  HolidayTableCompanion.insert({
    this.id = const Value.absent(),
    required DateTime date,
    required String name,
    required String type,
    this.regionId = const Value.absent(),
  })  : date = Value(date),
        name = Value(name),
        type = Value(type);
  static Insertable<HolidayEntry> custom({
    Expression<int>? id,
    Expression<DateTime>? date,
    Expression<String>? name,
    Expression<String>? type,
    Expression<String>? regionId,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (date != null) 'date': date,
      if (name != null) 'name': name,
      if (type != null) 'type': type,
      if (regionId != null) 'region_id': regionId,
    });
  }

  HolidayTableCompanion copyWith(
      {Value<int>? id,
      Value<DateTime>? date,
      Value<String>? name,
      Value<String>? type,
      Value<String?>? regionId}) {
    return HolidayTableCompanion(
      id: id ?? this.id,
      date: date ?? this.date,
      name: name ?? this.name,
      type: type ?? this.type,
      regionId: regionId ?? this.regionId,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (date.present) {
      map['date'] = Variable<DateTime>(date.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (type.present) {
      map['type'] = Variable<String>(type.value);
    }
    if (regionId.present) {
      map['region_id'] = Variable<String>(regionId.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('HolidayTableCompanion(')
          ..write('id: $id, ')
          ..write('date: $date, ')
          ..write('name: $name, ')
          ..write('type: $type, ')
          ..write('regionId: $regionId')
          ..write(')'))
        .toString();
  }
}

class $JointWorkTableTable extends JointWorkTable
    with TableInfo<$JointWorkTableTable, JointWorkEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $JointWorkTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<DateTime> date = GeneratedColumn<DateTime>(
      'date', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _managerIdMeta =
      const VerificationMeta('managerId');
  @override
  late final GeneratedColumn<String> managerId = GeneratedColumn<String>(
      'manager_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _managerNameMeta =
      const VerificationMeta('managerName');
  @override
  late final GeneratedColumn<String> managerName = GeneratedColumn<String>(
      'manager_name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns =>
      [id, date, managerId, managerName, syncStatus];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'joint_work_table';
  @override
  VerificationContext validateIntegrity(Insertable<JointWorkEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('date')) {
      context.handle(
          _dateMeta, date.isAcceptableOrUnknown(data['date']!, _dateMeta));
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('manager_id')) {
      context.handle(_managerIdMeta,
          managerId.isAcceptableOrUnknown(data['manager_id']!, _managerIdMeta));
    } else if (isInserting) {
      context.missing(_managerIdMeta);
    }
    if (data.containsKey('manager_name')) {
      context.handle(
          _managerNameMeta,
          managerName.isAcceptableOrUnknown(
              data['manager_name']!, _managerNameMeta));
    } else if (isInserting) {
      context.missing(_managerNameMeta);
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  JointWorkEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return JointWorkEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      date: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}date'])!,
      managerId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}manager_id'])!,
      managerName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}manager_name'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $JointWorkTableTable createAlias(String alias) {
    return $JointWorkTableTable(attachedDatabase, alias);
  }
}

class JointWorkEntry extends DataClass implements Insertable<JointWorkEntry> {
  final int id;
  final DateTime date;
  final String managerId;
  final String managerName;
  final int syncStatus;
  const JointWorkEntry(
      {required this.id,
      required this.date,
      required this.managerId,
      required this.managerName,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['date'] = Variable<DateTime>(date);
    map['manager_id'] = Variable<String>(managerId);
    map['manager_name'] = Variable<String>(managerName);
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  JointWorkTableCompanion toCompanion(bool nullToAbsent) {
    return JointWorkTableCompanion(
      id: Value(id),
      date: Value(date),
      managerId: Value(managerId),
      managerName: Value(managerName),
      syncStatus: Value(syncStatus),
    );
  }

  factory JointWorkEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return JointWorkEntry(
      id: serializer.fromJson<int>(json['id']),
      date: serializer.fromJson<DateTime>(json['date']),
      managerId: serializer.fromJson<String>(json['managerId']),
      managerName: serializer.fromJson<String>(json['managerName']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'date': serializer.toJson<DateTime>(date),
      'managerId': serializer.toJson<String>(managerId),
      'managerName': serializer.toJson<String>(managerName),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  JointWorkEntry copyWith(
          {int? id,
          DateTime? date,
          String? managerId,
          String? managerName,
          int? syncStatus}) =>
      JointWorkEntry(
        id: id ?? this.id,
        date: date ?? this.date,
        managerId: managerId ?? this.managerId,
        managerName: managerName ?? this.managerName,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  JointWorkEntry copyWithCompanion(JointWorkTableCompanion data) {
    return JointWorkEntry(
      id: data.id.present ? data.id.value : this.id,
      date: data.date.present ? data.date.value : this.date,
      managerId: data.managerId.present ? data.managerId.value : this.managerId,
      managerName:
          data.managerName.present ? data.managerName.value : this.managerName,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('JointWorkEntry(')
          ..write('id: $id, ')
          ..write('date: $date, ')
          ..write('managerId: $managerId, ')
          ..write('managerName: $managerName, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, date, managerId, managerName, syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is JointWorkEntry &&
          other.id == this.id &&
          other.date == this.date &&
          other.managerId == this.managerId &&
          other.managerName == this.managerName &&
          other.syncStatus == this.syncStatus);
}

class JointWorkTableCompanion extends UpdateCompanion<JointWorkEntry> {
  final Value<int> id;
  final Value<DateTime> date;
  final Value<String> managerId;
  final Value<String> managerName;
  final Value<int> syncStatus;
  const JointWorkTableCompanion({
    this.id = const Value.absent(),
    this.date = const Value.absent(),
    this.managerId = const Value.absent(),
    this.managerName = const Value.absent(),
    this.syncStatus = const Value.absent(),
  });
  JointWorkTableCompanion.insert({
    this.id = const Value.absent(),
    required DateTime date,
    required String managerId,
    required String managerName,
    this.syncStatus = const Value.absent(),
  })  : date = Value(date),
        managerId = Value(managerId),
        managerName = Value(managerName);
  static Insertable<JointWorkEntry> custom({
    Expression<int>? id,
    Expression<DateTime>? date,
    Expression<String>? managerId,
    Expression<String>? managerName,
    Expression<int>? syncStatus,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (date != null) 'date': date,
      if (managerId != null) 'manager_id': managerId,
      if (managerName != null) 'manager_name': managerName,
      if (syncStatus != null) 'sync_status': syncStatus,
    });
  }

  JointWorkTableCompanion copyWith(
      {Value<int>? id,
      Value<DateTime>? date,
      Value<String>? managerId,
      Value<String>? managerName,
      Value<int>? syncStatus}) {
    return JointWorkTableCompanion(
      id: id ?? this.id,
      date: date ?? this.date,
      managerId: managerId ?? this.managerId,
      managerName: managerName ?? this.managerName,
      syncStatus: syncStatus ?? this.syncStatus,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (date.present) {
      map['date'] = Variable<DateTime>(date.value);
    }
    if (managerId.present) {
      map['manager_id'] = Variable<String>(managerId.value);
    }
    if (managerName.present) {
      map['manager_name'] = Variable<String>(managerName.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('JointWorkTableCompanion(')
          ..write('id: $id, ')
          ..write('date: $date, ')
          ..write('managerId: $managerId, ')
          ..write('managerName: $managerName, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }
}

class $MiscExpenseTableTable extends MiscExpenseTable
    with TableInfo<$MiscExpenseTableTable, MiscExpenseEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MiscExpenseTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _expenseIdMeta =
      const VerificationMeta('expenseId');
  @override
  late final GeneratedColumn<String> expenseId = GeneratedColumn<String>(
      'expense_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _categoryMeta =
      const VerificationMeta('category');
  @override
  late final GeneratedColumn<String> category = GeneratedColumn<String>(
      'category', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _amountMeta = const VerificationMeta('amount');
  @override
  late final GeneratedColumn<double> amount = GeneratedColumn<double>(
      'amount', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0.0));
  static const VerificationMeta _remarksMeta =
      const VerificationMeta('remarks');
  @override
  late final GeneratedColumn<String> remarks = GeneratedColumn<String>(
      'remarks', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  @override
  List<GeneratedColumn> get $columns =>
      [id, expenseId, category, amount, remarks];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'misc_expense_table';
  @override
  VerificationContext validateIntegrity(Insertable<MiscExpenseEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('expense_id')) {
      context.handle(_expenseIdMeta,
          expenseId.isAcceptableOrUnknown(data['expense_id']!, _expenseIdMeta));
    } else if (isInserting) {
      context.missing(_expenseIdMeta);
    }
    if (data.containsKey('category')) {
      context.handle(_categoryMeta,
          category.isAcceptableOrUnknown(data['category']!, _categoryMeta));
    } else if (isInserting) {
      context.missing(_categoryMeta);
    }
    if (data.containsKey('amount')) {
      context.handle(_amountMeta,
          amount.isAcceptableOrUnknown(data['amount']!, _amountMeta));
    }
    if (data.containsKey('remarks')) {
      context.handle(_remarksMeta,
          remarks.isAcceptableOrUnknown(data['remarks']!, _remarksMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MiscExpenseEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MiscExpenseEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      expenseId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}expense_id'])!,
      category: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}category'])!,
      amount: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}amount'])!,
      remarks: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}remarks']),
    );
  }

  @override
  $MiscExpenseTableTable createAlias(String alias) {
    return $MiscExpenseTableTable(attachedDatabase, alias);
  }
}

class MiscExpenseEntry extends DataClass
    implements Insertable<MiscExpenseEntry> {
  final String id;
  final String expenseId;
  final String category;
  final double amount;
  final String? remarks;
  const MiscExpenseEntry(
      {required this.id,
      required this.expenseId,
      required this.category,
      required this.amount,
      this.remarks});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['expense_id'] = Variable<String>(expenseId);
    map['category'] = Variable<String>(category);
    map['amount'] = Variable<double>(amount);
    if (!nullToAbsent || remarks != null) {
      map['remarks'] = Variable<String>(remarks);
    }
    return map;
  }

  MiscExpenseTableCompanion toCompanion(bool nullToAbsent) {
    return MiscExpenseTableCompanion(
      id: Value(id),
      expenseId: Value(expenseId),
      category: Value(category),
      amount: Value(amount),
      remarks: remarks == null && nullToAbsent
          ? const Value.absent()
          : Value(remarks),
    );
  }

  factory MiscExpenseEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MiscExpenseEntry(
      id: serializer.fromJson<String>(json['id']),
      expenseId: serializer.fromJson<String>(json['expenseId']),
      category: serializer.fromJson<String>(json['category']),
      amount: serializer.fromJson<double>(json['amount']),
      remarks: serializer.fromJson<String?>(json['remarks']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'expenseId': serializer.toJson<String>(expenseId),
      'category': serializer.toJson<String>(category),
      'amount': serializer.toJson<double>(amount),
      'remarks': serializer.toJson<String?>(remarks),
    };
  }

  MiscExpenseEntry copyWith(
          {String? id,
          String? expenseId,
          String? category,
          double? amount,
          Value<String?> remarks = const Value.absent()}) =>
      MiscExpenseEntry(
        id: id ?? this.id,
        expenseId: expenseId ?? this.expenseId,
        category: category ?? this.category,
        amount: amount ?? this.amount,
        remarks: remarks.present ? remarks.value : this.remarks,
      );
  MiscExpenseEntry copyWithCompanion(MiscExpenseTableCompanion data) {
    return MiscExpenseEntry(
      id: data.id.present ? data.id.value : this.id,
      expenseId: data.expenseId.present ? data.expenseId.value : this.expenseId,
      category: data.category.present ? data.category.value : this.category,
      amount: data.amount.present ? data.amount.value : this.amount,
      remarks: data.remarks.present ? data.remarks.value : this.remarks,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MiscExpenseEntry(')
          ..write('id: $id, ')
          ..write('expenseId: $expenseId, ')
          ..write('category: $category, ')
          ..write('amount: $amount, ')
          ..write('remarks: $remarks')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, expenseId, category, amount, remarks);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MiscExpenseEntry &&
          other.id == this.id &&
          other.expenseId == this.expenseId &&
          other.category == this.category &&
          other.amount == this.amount &&
          other.remarks == this.remarks);
}

class MiscExpenseTableCompanion extends UpdateCompanion<MiscExpenseEntry> {
  final Value<String> id;
  final Value<String> expenseId;
  final Value<String> category;
  final Value<double> amount;
  final Value<String?> remarks;
  final Value<int> rowid;
  const MiscExpenseTableCompanion({
    this.id = const Value.absent(),
    this.expenseId = const Value.absent(),
    this.category = const Value.absent(),
    this.amount = const Value.absent(),
    this.remarks = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  MiscExpenseTableCompanion.insert({
    required String id,
    required String expenseId,
    required String category,
    this.amount = const Value.absent(),
    this.remarks = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        expenseId = Value(expenseId),
        category = Value(category);
  static Insertable<MiscExpenseEntry> custom({
    Expression<String>? id,
    Expression<String>? expenseId,
    Expression<String>? category,
    Expression<double>? amount,
    Expression<String>? remarks,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (expenseId != null) 'expense_id': expenseId,
      if (category != null) 'category': category,
      if (amount != null) 'amount': amount,
      if (remarks != null) 'remarks': remarks,
      if (rowid != null) 'rowid': rowid,
    });
  }

  MiscExpenseTableCompanion copyWith(
      {Value<String>? id,
      Value<String>? expenseId,
      Value<String>? category,
      Value<double>? amount,
      Value<String?>? remarks,
      Value<int>? rowid}) {
    return MiscExpenseTableCompanion(
      id: id ?? this.id,
      expenseId: expenseId ?? this.expenseId,
      category: category ?? this.category,
      amount: amount ?? this.amount,
      remarks: remarks ?? this.remarks,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (expenseId.present) {
      map['expense_id'] = Variable<String>(expenseId.value);
    }
    if (category.present) {
      map['category'] = Variable<String>(category.value);
    }
    if (amount.present) {
      map['amount'] = Variable<double>(amount.value);
    }
    if (remarks.present) {
      map['remarks'] = Variable<String>(remarks.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MiscExpenseTableCompanion(')
          ..write('id: $id, ')
          ..write('expenseId: $expenseId, ')
          ..write('category: $category, ')
          ..write('amount: $amount, ')
          ..write('remarks: $remarks, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $MtpAuditTableTable extends MtpAuditTable
    with TableInfo<$MtpAuditTableTable, MtpAuditEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MtpAuditTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _mtpIdMeta = const VerificationMeta('mtpId');
  @override
  late final GeneratedColumn<String> mtpId = GeneratedColumn<String>(
      'mtp_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _actionByMeta =
      const VerificationMeta('actionBy');
  @override
  late final GeneratedColumn<String> actionBy = GeneratedColumn<String>(
      'action_by', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _actionByNameMeta =
      const VerificationMeta('actionByName');
  @override
  late final GeneratedColumn<String> actionByName = GeneratedColumn<String>(
      'action_by_name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _previousStatusMeta =
      const VerificationMeta('previousStatus');
  @override
  late final GeneratedColumn<String> previousStatus = GeneratedColumn<String>(
      'previous_status', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _newStatusMeta =
      const VerificationMeta('newStatus');
  @override
  late final GeneratedColumn<String> newStatus = GeneratedColumn<String>(
      'new_status', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _remarksMeta =
      const VerificationMeta('remarks');
  @override
  late final GeneratedColumn<String> remarks = GeneratedColumn<String>(
      'remarks', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _actionDateMeta =
      const VerificationMeta('actionDate');
  @override
  late final GeneratedColumn<DateTime> actionDate = GeneratedColumn<DateTime>(
      'action_date', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns => [
        id,
        mtpId,
        actionBy,
        actionByName,
        previousStatus,
        newStatus,
        remarks,
        actionDate,
        syncStatus
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'mtp_audit_table';
  @override
  VerificationContext validateIntegrity(Insertable<MtpAuditEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('mtp_id')) {
      context.handle(
          _mtpIdMeta, mtpId.isAcceptableOrUnknown(data['mtp_id']!, _mtpIdMeta));
    } else if (isInserting) {
      context.missing(_mtpIdMeta);
    }
    if (data.containsKey('action_by')) {
      context.handle(_actionByMeta,
          actionBy.isAcceptableOrUnknown(data['action_by']!, _actionByMeta));
    } else if (isInserting) {
      context.missing(_actionByMeta);
    }
    if (data.containsKey('action_by_name')) {
      context.handle(
          _actionByNameMeta,
          actionByName.isAcceptableOrUnknown(
              data['action_by_name']!, _actionByNameMeta));
    } else if (isInserting) {
      context.missing(_actionByNameMeta);
    }
    if (data.containsKey('previous_status')) {
      context.handle(
          _previousStatusMeta,
          previousStatus.isAcceptableOrUnknown(
              data['previous_status']!, _previousStatusMeta));
    } else if (isInserting) {
      context.missing(_previousStatusMeta);
    }
    if (data.containsKey('new_status')) {
      context.handle(_newStatusMeta,
          newStatus.isAcceptableOrUnknown(data['new_status']!, _newStatusMeta));
    } else if (isInserting) {
      context.missing(_newStatusMeta);
    }
    if (data.containsKey('remarks')) {
      context.handle(_remarksMeta,
          remarks.isAcceptableOrUnknown(data['remarks']!, _remarksMeta));
    }
    if (data.containsKey('action_date')) {
      context.handle(
          _actionDateMeta,
          actionDate.isAcceptableOrUnknown(
              data['action_date']!, _actionDateMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MtpAuditEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MtpAuditEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      mtpId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}mtp_id'])!,
      actionBy: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}action_by'])!,
      actionByName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}action_by_name'])!,
      previousStatus: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}previous_status'])!,
      newStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}new_status'])!,
      remarks: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}remarks']),
      actionDate: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}action_date'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $MtpAuditTableTable createAlias(String alias) {
    return $MtpAuditTableTable(attachedDatabase, alias);
  }
}

class MtpAuditEntry extends DataClass implements Insertable<MtpAuditEntry> {
  final int id;
  final String mtpId;
  final String actionBy;
  final String actionByName;
  final String previousStatus;
  final String newStatus;
  final String? remarks;
  final DateTime actionDate;
  final int syncStatus;
  const MtpAuditEntry(
      {required this.id,
      required this.mtpId,
      required this.actionBy,
      required this.actionByName,
      required this.previousStatus,
      required this.newStatus,
      this.remarks,
      required this.actionDate,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['mtp_id'] = Variable<String>(mtpId);
    map['action_by'] = Variable<String>(actionBy);
    map['action_by_name'] = Variable<String>(actionByName);
    map['previous_status'] = Variable<String>(previousStatus);
    map['new_status'] = Variable<String>(newStatus);
    if (!nullToAbsent || remarks != null) {
      map['remarks'] = Variable<String>(remarks);
    }
    map['action_date'] = Variable<DateTime>(actionDate);
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  MtpAuditTableCompanion toCompanion(bool nullToAbsent) {
    return MtpAuditTableCompanion(
      id: Value(id),
      mtpId: Value(mtpId),
      actionBy: Value(actionBy),
      actionByName: Value(actionByName),
      previousStatus: Value(previousStatus),
      newStatus: Value(newStatus),
      remarks: remarks == null && nullToAbsent
          ? const Value.absent()
          : Value(remarks),
      actionDate: Value(actionDate),
      syncStatus: Value(syncStatus),
    );
  }

  factory MtpAuditEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MtpAuditEntry(
      id: serializer.fromJson<int>(json['id']),
      mtpId: serializer.fromJson<String>(json['mtpId']),
      actionBy: serializer.fromJson<String>(json['actionBy']),
      actionByName: serializer.fromJson<String>(json['actionByName']),
      previousStatus: serializer.fromJson<String>(json['previousStatus']),
      newStatus: serializer.fromJson<String>(json['newStatus']),
      remarks: serializer.fromJson<String?>(json['remarks']),
      actionDate: serializer.fromJson<DateTime>(json['actionDate']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'mtpId': serializer.toJson<String>(mtpId),
      'actionBy': serializer.toJson<String>(actionBy),
      'actionByName': serializer.toJson<String>(actionByName),
      'previousStatus': serializer.toJson<String>(previousStatus),
      'newStatus': serializer.toJson<String>(newStatus),
      'remarks': serializer.toJson<String?>(remarks),
      'actionDate': serializer.toJson<DateTime>(actionDate),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  MtpAuditEntry copyWith(
          {int? id,
          String? mtpId,
          String? actionBy,
          String? actionByName,
          String? previousStatus,
          String? newStatus,
          Value<String?> remarks = const Value.absent(),
          DateTime? actionDate,
          int? syncStatus}) =>
      MtpAuditEntry(
        id: id ?? this.id,
        mtpId: mtpId ?? this.mtpId,
        actionBy: actionBy ?? this.actionBy,
        actionByName: actionByName ?? this.actionByName,
        previousStatus: previousStatus ?? this.previousStatus,
        newStatus: newStatus ?? this.newStatus,
        remarks: remarks.present ? remarks.value : this.remarks,
        actionDate: actionDate ?? this.actionDate,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  MtpAuditEntry copyWithCompanion(MtpAuditTableCompanion data) {
    return MtpAuditEntry(
      id: data.id.present ? data.id.value : this.id,
      mtpId: data.mtpId.present ? data.mtpId.value : this.mtpId,
      actionBy: data.actionBy.present ? data.actionBy.value : this.actionBy,
      actionByName: data.actionByName.present
          ? data.actionByName.value
          : this.actionByName,
      previousStatus: data.previousStatus.present
          ? data.previousStatus.value
          : this.previousStatus,
      newStatus: data.newStatus.present ? data.newStatus.value : this.newStatus,
      remarks: data.remarks.present ? data.remarks.value : this.remarks,
      actionDate:
          data.actionDate.present ? data.actionDate.value : this.actionDate,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MtpAuditEntry(')
          ..write('id: $id, ')
          ..write('mtpId: $mtpId, ')
          ..write('actionBy: $actionBy, ')
          ..write('actionByName: $actionByName, ')
          ..write('previousStatus: $previousStatus, ')
          ..write('newStatus: $newStatus, ')
          ..write('remarks: $remarks, ')
          ..write('actionDate: $actionDate, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, mtpId, actionBy, actionByName,
      previousStatus, newStatus, remarks, actionDate, syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MtpAuditEntry &&
          other.id == this.id &&
          other.mtpId == this.mtpId &&
          other.actionBy == this.actionBy &&
          other.actionByName == this.actionByName &&
          other.previousStatus == this.previousStatus &&
          other.newStatus == this.newStatus &&
          other.remarks == this.remarks &&
          other.actionDate == this.actionDate &&
          other.syncStatus == this.syncStatus);
}

class MtpAuditTableCompanion extends UpdateCompanion<MtpAuditEntry> {
  final Value<int> id;
  final Value<String> mtpId;
  final Value<String> actionBy;
  final Value<String> actionByName;
  final Value<String> previousStatus;
  final Value<String> newStatus;
  final Value<String?> remarks;
  final Value<DateTime> actionDate;
  final Value<int> syncStatus;
  const MtpAuditTableCompanion({
    this.id = const Value.absent(),
    this.mtpId = const Value.absent(),
    this.actionBy = const Value.absent(),
    this.actionByName = const Value.absent(),
    this.previousStatus = const Value.absent(),
    this.newStatus = const Value.absent(),
    this.remarks = const Value.absent(),
    this.actionDate = const Value.absent(),
    this.syncStatus = const Value.absent(),
  });
  MtpAuditTableCompanion.insert({
    this.id = const Value.absent(),
    required String mtpId,
    required String actionBy,
    required String actionByName,
    required String previousStatus,
    required String newStatus,
    this.remarks = const Value.absent(),
    this.actionDate = const Value.absent(),
    this.syncStatus = const Value.absent(),
  })  : mtpId = Value(mtpId),
        actionBy = Value(actionBy),
        actionByName = Value(actionByName),
        previousStatus = Value(previousStatus),
        newStatus = Value(newStatus);
  static Insertable<MtpAuditEntry> custom({
    Expression<int>? id,
    Expression<String>? mtpId,
    Expression<String>? actionBy,
    Expression<String>? actionByName,
    Expression<String>? previousStatus,
    Expression<String>? newStatus,
    Expression<String>? remarks,
    Expression<DateTime>? actionDate,
    Expression<int>? syncStatus,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (mtpId != null) 'mtp_id': mtpId,
      if (actionBy != null) 'action_by': actionBy,
      if (actionByName != null) 'action_by_name': actionByName,
      if (previousStatus != null) 'previous_status': previousStatus,
      if (newStatus != null) 'new_status': newStatus,
      if (remarks != null) 'remarks': remarks,
      if (actionDate != null) 'action_date': actionDate,
      if (syncStatus != null) 'sync_status': syncStatus,
    });
  }

  MtpAuditTableCompanion copyWith(
      {Value<int>? id,
      Value<String>? mtpId,
      Value<String>? actionBy,
      Value<String>? actionByName,
      Value<String>? previousStatus,
      Value<String>? newStatus,
      Value<String?>? remarks,
      Value<DateTime>? actionDate,
      Value<int>? syncStatus}) {
    return MtpAuditTableCompanion(
      id: id ?? this.id,
      mtpId: mtpId ?? this.mtpId,
      actionBy: actionBy ?? this.actionBy,
      actionByName: actionByName ?? this.actionByName,
      previousStatus: previousStatus ?? this.previousStatus,
      newStatus: newStatus ?? this.newStatus,
      remarks: remarks ?? this.remarks,
      actionDate: actionDate ?? this.actionDate,
      syncStatus: syncStatus ?? this.syncStatus,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (mtpId.present) {
      map['mtp_id'] = Variable<String>(mtpId.value);
    }
    if (actionBy.present) {
      map['action_by'] = Variable<String>(actionBy.value);
    }
    if (actionByName.present) {
      map['action_by_name'] = Variable<String>(actionByName.value);
    }
    if (previousStatus.present) {
      map['previous_status'] = Variable<String>(previousStatus.value);
    }
    if (newStatus.present) {
      map['new_status'] = Variable<String>(newStatus.value);
    }
    if (remarks.present) {
      map['remarks'] = Variable<String>(remarks.value);
    }
    if (actionDate.present) {
      map['action_date'] = Variable<DateTime>(actionDate.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MtpAuditTableCompanion(')
          ..write('id: $id, ')
          ..write('mtpId: $mtpId, ')
          ..write('actionBy: $actionBy, ')
          ..write('actionByName: $actionByName, ')
          ..write('previousStatus: $previousStatus, ')
          ..write('newStatus: $newStatus, ')
          ..write('remarks: $remarks, ')
          ..write('actionDate: $actionDate, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }
}

class $MtpSettingsTableTable extends MtpSettingsTable
    with TableInfo<$MtpSettingsTableTable, MtpSettingsEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MtpSettingsTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _submissionDeadlineDayMeta =
      const VerificationMeta('submissionDeadlineDay');
  @override
  late final GeneratedColumn<int> submissionDeadlineDay = GeneratedColumn<int>(
      'submission_deadline_day', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(25));
  static const VerificationMeta _provisionalApprovalEndDayMeta =
      const VerificationMeta('provisionalApprovalEndDay');
  @override
  late final GeneratedColumn<int> provisionalApprovalEndDay =
      GeneratedColumn<int>('provisional_approval_end_day', aliasedName, false,
          type: DriftSqlType.int,
          requiredDuringInsert: false,
          defaultValue: const Constant(2));
  @override
  List<GeneratedColumn> get $columns =>
      [id, submissionDeadlineDay, provisionalApprovalEndDay];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'mtp_settings_table';
  @override
  VerificationContext validateIntegrity(Insertable<MtpSettingsEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('submission_deadline_day')) {
      context.handle(
          _submissionDeadlineDayMeta,
          submissionDeadlineDay.isAcceptableOrUnknown(
              data['submission_deadline_day']!, _submissionDeadlineDayMeta));
    }
    if (data.containsKey('provisional_approval_end_day')) {
      context.handle(
          _provisionalApprovalEndDayMeta,
          provisionalApprovalEndDay.isAcceptableOrUnknown(
              data['provisional_approval_end_day']!,
              _provisionalApprovalEndDayMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MtpSettingsEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MtpSettingsEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      submissionDeadlineDay: attachedDatabase.typeMapping.read(
          DriftSqlType.int, data['${effectivePrefix}submission_deadline_day'])!,
      provisionalApprovalEndDay: attachedDatabase.typeMapping.read(
          DriftSqlType.int,
          data['${effectivePrefix}provisional_approval_end_day'])!,
    );
  }

  @override
  $MtpSettingsTableTable createAlias(String alias) {
    return $MtpSettingsTableTable(attachedDatabase, alias);
  }
}

class MtpSettingsEntry extends DataClass
    implements Insertable<MtpSettingsEntry> {
  final String id;
  final int submissionDeadlineDay;
  final int provisionalApprovalEndDay;
  const MtpSettingsEntry(
      {required this.id,
      required this.submissionDeadlineDay,
      required this.provisionalApprovalEndDay});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['submission_deadline_day'] = Variable<int>(submissionDeadlineDay);
    map['provisional_approval_end_day'] =
        Variable<int>(provisionalApprovalEndDay);
    return map;
  }

  MtpSettingsTableCompanion toCompanion(bool nullToAbsent) {
    return MtpSettingsTableCompanion(
      id: Value(id),
      submissionDeadlineDay: Value(submissionDeadlineDay),
      provisionalApprovalEndDay: Value(provisionalApprovalEndDay),
    );
  }

  factory MtpSettingsEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MtpSettingsEntry(
      id: serializer.fromJson<String>(json['id']),
      submissionDeadlineDay:
          serializer.fromJson<int>(json['submissionDeadlineDay']),
      provisionalApprovalEndDay:
          serializer.fromJson<int>(json['provisionalApprovalEndDay']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'submissionDeadlineDay': serializer.toJson<int>(submissionDeadlineDay),
      'provisionalApprovalEndDay':
          serializer.toJson<int>(provisionalApprovalEndDay),
    };
  }

  MtpSettingsEntry copyWith(
          {String? id,
          int? submissionDeadlineDay,
          int? provisionalApprovalEndDay}) =>
      MtpSettingsEntry(
        id: id ?? this.id,
        submissionDeadlineDay:
            submissionDeadlineDay ?? this.submissionDeadlineDay,
        provisionalApprovalEndDay:
            provisionalApprovalEndDay ?? this.provisionalApprovalEndDay,
      );
  MtpSettingsEntry copyWithCompanion(MtpSettingsTableCompanion data) {
    return MtpSettingsEntry(
      id: data.id.present ? data.id.value : this.id,
      submissionDeadlineDay: data.submissionDeadlineDay.present
          ? data.submissionDeadlineDay.value
          : this.submissionDeadlineDay,
      provisionalApprovalEndDay: data.provisionalApprovalEndDay.present
          ? data.provisionalApprovalEndDay.value
          : this.provisionalApprovalEndDay,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MtpSettingsEntry(')
          ..write('id: $id, ')
          ..write('submissionDeadlineDay: $submissionDeadlineDay, ')
          ..write('provisionalApprovalEndDay: $provisionalApprovalEndDay')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, submissionDeadlineDay, provisionalApprovalEndDay);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MtpSettingsEntry &&
          other.id == this.id &&
          other.submissionDeadlineDay == this.submissionDeadlineDay &&
          other.provisionalApprovalEndDay == this.provisionalApprovalEndDay);
}

class MtpSettingsTableCompanion extends UpdateCompanion<MtpSettingsEntry> {
  final Value<String> id;
  final Value<int> submissionDeadlineDay;
  final Value<int> provisionalApprovalEndDay;
  final Value<int> rowid;
  const MtpSettingsTableCompanion({
    this.id = const Value.absent(),
    this.submissionDeadlineDay = const Value.absent(),
    this.provisionalApprovalEndDay = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  MtpSettingsTableCompanion.insert({
    required String id,
    this.submissionDeadlineDay = const Value.absent(),
    this.provisionalApprovalEndDay = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id);
  static Insertable<MtpSettingsEntry> custom({
    Expression<String>? id,
    Expression<int>? submissionDeadlineDay,
    Expression<int>? provisionalApprovalEndDay,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (submissionDeadlineDay != null)
        'submission_deadline_day': submissionDeadlineDay,
      if (provisionalApprovalEndDay != null)
        'provisional_approval_end_day': provisionalApprovalEndDay,
      if (rowid != null) 'rowid': rowid,
    });
  }

  MtpSettingsTableCompanion copyWith(
      {Value<String>? id,
      Value<int>? submissionDeadlineDay,
      Value<int>? provisionalApprovalEndDay,
      Value<int>? rowid}) {
    return MtpSettingsTableCompanion(
      id: id ?? this.id,
      submissionDeadlineDay:
          submissionDeadlineDay ?? this.submissionDeadlineDay,
      provisionalApprovalEndDay:
          provisionalApprovalEndDay ?? this.provisionalApprovalEndDay,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (submissionDeadlineDay.present) {
      map['submission_deadline_day'] =
          Variable<int>(submissionDeadlineDay.value);
    }
    if (provisionalApprovalEndDay.present) {
      map['provisional_approval_end_day'] =
          Variable<int>(provisionalApprovalEndDay.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MtpSettingsTableCompanion(')
          ..write('id: $id, ')
          ..write('submissionDeadlineDay: $submissionDeadlineDay, ')
          ..write('provisionalApprovalEndDay: $provisionalApprovalEndDay, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $MtpTableTable extends MtpTable with TableInfo<$MtpTableTable, MtpEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MtpTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _employeeIdMeta =
      const VerificationMeta('employeeId');
  @override
  late final GeneratedColumn<String> employeeId = GeneratedColumn<String>(
      'employee_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _monthMeta = const VerificationMeta('month');
  @override
  late final GeneratedColumn<int> month = GeneratedColumn<int>(
      'month', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _yearMeta = const VerificationMeta('year');
  @override
  late final GeneratedColumn<int> year = GeneratedColumn<int>(
      'year', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
      'status', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('DRAFT'));
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns =>
      [id, employeeId, month, year, status, syncStatus, createdAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'mtp_table';
  @override
  VerificationContext validateIntegrity(Insertable<MtpEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('employee_id')) {
      context.handle(
          _employeeIdMeta,
          employeeId.isAcceptableOrUnknown(
              data['employee_id']!, _employeeIdMeta));
    } else if (isInserting) {
      context.missing(_employeeIdMeta);
    }
    if (data.containsKey('month')) {
      context.handle(
          _monthMeta, month.isAcceptableOrUnknown(data['month']!, _monthMeta));
    } else if (isInserting) {
      context.missing(_monthMeta);
    }
    if (data.containsKey('year')) {
      context.handle(
          _yearMeta, year.isAcceptableOrUnknown(data['year']!, _yearMeta));
    } else if (isInserting) {
      context.missing(_yearMeta);
    }
    if (data.containsKey('status')) {
      context.handle(_statusMeta,
          status.isAcceptableOrUnknown(data['status']!, _statusMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MtpEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MtpEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      employeeId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}employee_id'])!,
      month: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}month'])!,
      year: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}year'])!,
      status: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}status'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  $MtpTableTable createAlias(String alias) {
    return $MtpTableTable(attachedDatabase, alias);
  }
}

class MtpEntry extends DataClass implements Insertable<MtpEntry> {
  final int id;
  final String employeeId;
  final int month;
  final int year;
  final String status;
  final int syncStatus;
  final DateTime createdAt;
  const MtpEntry(
      {required this.id,
      required this.employeeId,
      required this.month,
      required this.year,
      required this.status,
      required this.syncStatus,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['employee_id'] = Variable<String>(employeeId);
    map['month'] = Variable<int>(month);
    map['year'] = Variable<int>(year);
    map['status'] = Variable<String>(status);
    map['sync_status'] = Variable<int>(syncStatus);
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  MtpTableCompanion toCompanion(bool nullToAbsent) {
    return MtpTableCompanion(
      id: Value(id),
      employeeId: Value(employeeId),
      month: Value(month),
      year: Value(year),
      status: Value(status),
      syncStatus: Value(syncStatus),
      createdAt: Value(createdAt),
    );
  }

  factory MtpEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MtpEntry(
      id: serializer.fromJson<int>(json['id']),
      employeeId: serializer.fromJson<String>(json['employeeId']),
      month: serializer.fromJson<int>(json['month']),
      year: serializer.fromJson<int>(json['year']),
      status: serializer.fromJson<String>(json['status']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'employeeId': serializer.toJson<String>(employeeId),
      'month': serializer.toJson<int>(month),
      'year': serializer.toJson<int>(year),
      'status': serializer.toJson<String>(status),
      'syncStatus': serializer.toJson<int>(syncStatus),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  MtpEntry copyWith(
          {int? id,
          String? employeeId,
          int? month,
          int? year,
          String? status,
          int? syncStatus,
          DateTime? createdAt}) =>
      MtpEntry(
        id: id ?? this.id,
        employeeId: employeeId ?? this.employeeId,
        month: month ?? this.month,
        year: year ?? this.year,
        status: status ?? this.status,
        syncStatus: syncStatus ?? this.syncStatus,
        createdAt: createdAt ?? this.createdAt,
      );
  MtpEntry copyWithCompanion(MtpTableCompanion data) {
    return MtpEntry(
      id: data.id.present ? data.id.value : this.id,
      employeeId:
          data.employeeId.present ? data.employeeId.value : this.employeeId,
      month: data.month.present ? data.month.value : this.month,
      year: data.year.present ? data.year.value : this.year,
      status: data.status.present ? data.status.value : this.status,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MtpEntry(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('month: $month, ')
          ..write('year: $year, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, employeeId, month, year, status, syncStatus, createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MtpEntry &&
          other.id == this.id &&
          other.employeeId == this.employeeId &&
          other.month == this.month &&
          other.year == this.year &&
          other.status == this.status &&
          other.syncStatus == this.syncStatus &&
          other.createdAt == this.createdAt);
}

class MtpTableCompanion extends UpdateCompanion<MtpEntry> {
  final Value<int> id;
  final Value<String> employeeId;
  final Value<int> month;
  final Value<int> year;
  final Value<String> status;
  final Value<int> syncStatus;
  final Value<DateTime> createdAt;
  const MtpTableCompanion({
    this.id = const Value.absent(),
    this.employeeId = const Value.absent(),
    this.month = const Value.absent(),
    this.year = const Value.absent(),
    this.status = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  });
  MtpTableCompanion.insert({
    this.id = const Value.absent(),
    required String employeeId,
    required int month,
    required int year,
    this.status = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.createdAt = const Value.absent(),
  })  : employeeId = Value(employeeId),
        month = Value(month),
        year = Value(year);
  static Insertable<MtpEntry> custom({
    Expression<int>? id,
    Expression<String>? employeeId,
    Expression<int>? month,
    Expression<int>? year,
    Expression<String>? status,
    Expression<int>? syncStatus,
    Expression<DateTime>? createdAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (employeeId != null) 'employee_id': employeeId,
      if (month != null) 'month': month,
      if (year != null) 'year': year,
      if (status != null) 'status': status,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (createdAt != null) 'created_at': createdAt,
    });
  }

  MtpTableCompanion copyWith(
      {Value<int>? id,
      Value<String>? employeeId,
      Value<int>? month,
      Value<int>? year,
      Value<String>? status,
      Value<int>? syncStatus,
      Value<DateTime>? createdAt}) {
    return MtpTableCompanion(
      id: id ?? this.id,
      employeeId: employeeId ?? this.employeeId,
      month: month ?? this.month,
      year: year ?? this.year,
      status: status ?? this.status,
      syncStatus: syncStatus ?? this.syncStatus,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (employeeId.present) {
      map['employee_id'] = Variable<String>(employeeId.value);
    }
    if (month.present) {
      map['month'] = Variable<int>(month.value);
    }
    if (year.present) {
      map['year'] = Variable<int>(year.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MtpTableCompanion(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('month: $month, ')
          ..write('year: $year, ')
          ..write('status: $status, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }
}

class $MtpDayTableTable extends MtpDayTable
    with TableInfo<$MtpDayTableTable, MtpDayEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MtpDayTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _mtpIdMeta = const VerificationMeta('mtpId');
  @override
  late final GeneratedColumn<int> mtpId = GeneratedColumn<int>(
      'mtp_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'REFERENCES mtp_table(id)');
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<DateTime> date = GeneratedColumn<DateTime>(
      'date', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _workTypeMeta =
      const VerificationMeta('workType');
  @override
  late final GeneratedColumn<String> workType = GeneratedColumn<String>(
      'work_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _locationTypeMeta =
      const VerificationMeta('locationType');
  @override
  late final GeneratedColumn<String> locationType = GeneratedColumn<String>(
      'location_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _notesMeta = const VerificationMeta('notes');
  @override
  late final GeneratedColumn<String> notes = GeneratedColumn<String>(
      'notes', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  @override
  List<GeneratedColumn> get $columns =>
      [id, mtpId, date, workType, locationType, notes];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'mtp_day_table';
  @override
  VerificationContext validateIntegrity(Insertable<MtpDayEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('mtp_id')) {
      context.handle(
          _mtpIdMeta, mtpId.isAcceptableOrUnknown(data['mtp_id']!, _mtpIdMeta));
    } else if (isInserting) {
      context.missing(_mtpIdMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
          _dateMeta, date.isAcceptableOrUnknown(data['date']!, _dateMeta));
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('work_type')) {
      context.handle(_workTypeMeta,
          workType.isAcceptableOrUnknown(data['work_type']!, _workTypeMeta));
    } else if (isInserting) {
      context.missing(_workTypeMeta);
    }
    if (data.containsKey('location_type')) {
      context.handle(
          _locationTypeMeta,
          locationType.isAcceptableOrUnknown(
              data['location_type']!, _locationTypeMeta));
    } else if (isInserting) {
      context.missing(_locationTypeMeta);
    }
    if (data.containsKey('notes')) {
      context.handle(
          _notesMeta, notes.isAcceptableOrUnknown(data['notes']!, _notesMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MtpDayEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MtpDayEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      mtpId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}mtp_id'])!,
      date: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}date'])!,
      workType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}work_type'])!,
      locationType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}location_type'])!,
      notes: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}notes']),
    );
  }

  @override
  $MtpDayTableTable createAlias(String alias) {
    return $MtpDayTableTable(attachedDatabase, alias);
  }
}

class MtpDayEntry extends DataClass implements Insertable<MtpDayEntry> {
  final int id;
  final int mtpId;
  final DateTime date;
  final String workType;
  final String locationType;
  final String? notes;
  const MtpDayEntry(
      {required this.id,
      required this.mtpId,
      required this.date,
      required this.workType,
      required this.locationType,
      this.notes});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['mtp_id'] = Variable<int>(mtpId);
    map['date'] = Variable<DateTime>(date);
    map['work_type'] = Variable<String>(workType);
    map['location_type'] = Variable<String>(locationType);
    if (!nullToAbsent || notes != null) {
      map['notes'] = Variable<String>(notes);
    }
    return map;
  }

  MtpDayTableCompanion toCompanion(bool nullToAbsent) {
    return MtpDayTableCompanion(
      id: Value(id),
      mtpId: Value(mtpId),
      date: Value(date),
      workType: Value(workType),
      locationType: Value(locationType),
      notes:
          notes == null && nullToAbsent ? const Value.absent() : Value(notes),
    );
  }

  factory MtpDayEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MtpDayEntry(
      id: serializer.fromJson<int>(json['id']),
      mtpId: serializer.fromJson<int>(json['mtpId']),
      date: serializer.fromJson<DateTime>(json['date']),
      workType: serializer.fromJson<String>(json['workType']),
      locationType: serializer.fromJson<String>(json['locationType']),
      notes: serializer.fromJson<String?>(json['notes']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'mtpId': serializer.toJson<int>(mtpId),
      'date': serializer.toJson<DateTime>(date),
      'workType': serializer.toJson<String>(workType),
      'locationType': serializer.toJson<String>(locationType),
      'notes': serializer.toJson<String?>(notes),
    };
  }

  MtpDayEntry copyWith(
          {int? id,
          int? mtpId,
          DateTime? date,
          String? workType,
          String? locationType,
          Value<String?> notes = const Value.absent()}) =>
      MtpDayEntry(
        id: id ?? this.id,
        mtpId: mtpId ?? this.mtpId,
        date: date ?? this.date,
        workType: workType ?? this.workType,
        locationType: locationType ?? this.locationType,
        notes: notes.present ? notes.value : this.notes,
      );
  MtpDayEntry copyWithCompanion(MtpDayTableCompanion data) {
    return MtpDayEntry(
      id: data.id.present ? data.id.value : this.id,
      mtpId: data.mtpId.present ? data.mtpId.value : this.mtpId,
      date: data.date.present ? data.date.value : this.date,
      workType: data.workType.present ? data.workType.value : this.workType,
      locationType: data.locationType.present
          ? data.locationType.value
          : this.locationType,
      notes: data.notes.present ? data.notes.value : this.notes,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MtpDayEntry(')
          ..write('id: $id, ')
          ..write('mtpId: $mtpId, ')
          ..write('date: $date, ')
          ..write('workType: $workType, ')
          ..write('locationType: $locationType, ')
          ..write('notes: $notes')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, mtpId, date, workType, locationType, notes);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MtpDayEntry &&
          other.id == this.id &&
          other.mtpId == this.mtpId &&
          other.date == this.date &&
          other.workType == this.workType &&
          other.locationType == this.locationType &&
          other.notes == this.notes);
}

class MtpDayTableCompanion extends UpdateCompanion<MtpDayEntry> {
  final Value<int> id;
  final Value<int> mtpId;
  final Value<DateTime> date;
  final Value<String> workType;
  final Value<String> locationType;
  final Value<String?> notes;
  const MtpDayTableCompanion({
    this.id = const Value.absent(),
    this.mtpId = const Value.absent(),
    this.date = const Value.absent(),
    this.workType = const Value.absent(),
    this.locationType = const Value.absent(),
    this.notes = const Value.absent(),
  });
  MtpDayTableCompanion.insert({
    this.id = const Value.absent(),
    required int mtpId,
    required DateTime date,
    required String workType,
    required String locationType,
    this.notes = const Value.absent(),
  })  : mtpId = Value(mtpId),
        date = Value(date),
        workType = Value(workType),
        locationType = Value(locationType);
  static Insertable<MtpDayEntry> custom({
    Expression<int>? id,
    Expression<int>? mtpId,
    Expression<DateTime>? date,
    Expression<String>? workType,
    Expression<String>? locationType,
    Expression<String>? notes,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (mtpId != null) 'mtp_id': mtpId,
      if (date != null) 'date': date,
      if (workType != null) 'work_type': workType,
      if (locationType != null) 'location_type': locationType,
      if (notes != null) 'notes': notes,
    });
  }

  MtpDayTableCompanion copyWith(
      {Value<int>? id,
      Value<int>? mtpId,
      Value<DateTime>? date,
      Value<String>? workType,
      Value<String>? locationType,
      Value<String?>? notes}) {
    return MtpDayTableCompanion(
      id: id ?? this.id,
      mtpId: mtpId ?? this.mtpId,
      date: date ?? this.date,
      workType: workType ?? this.workType,
      locationType: locationType ?? this.locationType,
      notes: notes ?? this.notes,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (mtpId.present) {
      map['mtp_id'] = Variable<int>(mtpId.value);
    }
    if (date.present) {
      map['date'] = Variable<DateTime>(date.value);
    }
    if (workType.present) {
      map['work_type'] = Variable<String>(workType.value);
    }
    if (locationType.present) {
      map['location_type'] = Variable<String>(locationType.value);
    }
    if (notes.present) {
      map['notes'] = Variable<String>(notes.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MtpDayTableCompanion(')
          ..write('id: $id, ')
          ..write('mtpId: $mtpId, ')
          ..write('date: $date, ')
          ..write('workType: $workType, ')
          ..write('locationType: $locationType, ')
          ..write('notes: $notes')
          ..write(')'))
        .toString();
  }
}

class $MtpDoctorTableTable extends MtpDoctorTable
    with TableInfo<$MtpDoctorTableTable, MtpDoctorEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MtpDoctorTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _mtpDayIdMeta =
      const VerificationMeta('mtpDayId');
  @override
  late final GeneratedColumn<int> mtpDayId = GeneratedColumn<int>(
      'mtp_day_id', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: true,
      $customConstraints: 'REFERENCES mtp_day_table(id)');
  static const VerificationMeta _doctorIdMeta =
      const VerificationMeta('doctorId');
  @override
  late final GeneratedColumn<String> doctorId = GeneratedColumn<String>(
      'doctor_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _doctorNameMeta =
      const VerificationMeta('doctorName');
  @override
  late final GeneratedColumn<String> doctorName = GeneratedColumn<String>(
      'doctor_name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _specialtyMeta =
      const VerificationMeta('specialty');
  @override
  late final GeneratedColumn<String> specialty = GeneratedColumn<String>(
      'specialty', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns =>
      [id, mtpDayId, doctorId, doctorName, specialty];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'mtp_doctor_table';
  @override
  VerificationContext validateIntegrity(Insertable<MtpDoctorEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('mtp_day_id')) {
      context.handle(_mtpDayIdMeta,
          mtpDayId.isAcceptableOrUnknown(data['mtp_day_id']!, _mtpDayIdMeta));
    } else if (isInserting) {
      context.missing(_mtpDayIdMeta);
    }
    if (data.containsKey('doctor_id')) {
      context.handle(_doctorIdMeta,
          doctorId.isAcceptableOrUnknown(data['doctor_id']!, _doctorIdMeta));
    } else if (isInserting) {
      context.missing(_doctorIdMeta);
    }
    if (data.containsKey('doctor_name')) {
      context.handle(
          _doctorNameMeta,
          doctorName.isAcceptableOrUnknown(
              data['doctor_name']!, _doctorNameMeta));
    } else if (isInserting) {
      context.missing(_doctorNameMeta);
    }
    if (data.containsKey('specialty')) {
      context.handle(_specialtyMeta,
          specialty.isAcceptableOrUnknown(data['specialty']!, _specialtyMeta));
    } else if (isInserting) {
      context.missing(_specialtyMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MtpDoctorEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MtpDoctorEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      mtpDayId: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}mtp_day_id'])!,
      doctorId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}doctor_id'])!,
      doctorName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}doctor_name'])!,
      specialty: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}specialty'])!,
    );
  }

  @override
  $MtpDoctorTableTable createAlias(String alias) {
    return $MtpDoctorTableTable(attachedDatabase, alias);
  }
}

class MtpDoctorEntry extends DataClass implements Insertable<MtpDoctorEntry> {
  final int id;
  final int mtpDayId;
  final String doctorId;
  final String doctorName;
  final String specialty;
  const MtpDoctorEntry(
      {required this.id,
      required this.mtpDayId,
      required this.doctorId,
      required this.doctorName,
      required this.specialty});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['mtp_day_id'] = Variable<int>(mtpDayId);
    map['doctor_id'] = Variable<String>(doctorId);
    map['doctor_name'] = Variable<String>(doctorName);
    map['specialty'] = Variable<String>(specialty);
    return map;
  }

  MtpDoctorTableCompanion toCompanion(bool nullToAbsent) {
    return MtpDoctorTableCompanion(
      id: Value(id),
      mtpDayId: Value(mtpDayId),
      doctorId: Value(doctorId),
      doctorName: Value(doctorName),
      specialty: Value(specialty),
    );
  }

  factory MtpDoctorEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MtpDoctorEntry(
      id: serializer.fromJson<int>(json['id']),
      mtpDayId: serializer.fromJson<int>(json['mtpDayId']),
      doctorId: serializer.fromJson<String>(json['doctorId']),
      doctorName: serializer.fromJson<String>(json['doctorName']),
      specialty: serializer.fromJson<String>(json['specialty']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'mtpDayId': serializer.toJson<int>(mtpDayId),
      'doctorId': serializer.toJson<String>(doctorId),
      'doctorName': serializer.toJson<String>(doctorName),
      'specialty': serializer.toJson<String>(specialty),
    };
  }

  MtpDoctorEntry copyWith(
          {int? id,
          int? mtpDayId,
          String? doctorId,
          String? doctorName,
          String? specialty}) =>
      MtpDoctorEntry(
        id: id ?? this.id,
        mtpDayId: mtpDayId ?? this.mtpDayId,
        doctorId: doctorId ?? this.doctorId,
        doctorName: doctorName ?? this.doctorName,
        specialty: specialty ?? this.specialty,
      );
  MtpDoctorEntry copyWithCompanion(MtpDoctorTableCompanion data) {
    return MtpDoctorEntry(
      id: data.id.present ? data.id.value : this.id,
      mtpDayId: data.mtpDayId.present ? data.mtpDayId.value : this.mtpDayId,
      doctorId: data.doctorId.present ? data.doctorId.value : this.doctorId,
      doctorName:
          data.doctorName.present ? data.doctorName.value : this.doctorName,
      specialty: data.specialty.present ? data.specialty.value : this.specialty,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MtpDoctorEntry(')
          ..write('id: $id, ')
          ..write('mtpDayId: $mtpDayId, ')
          ..write('doctorId: $doctorId, ')
          ..write('doctorName: $doctorName, ')
          ..write('specialty: $specialty')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, mtpDayId, doctorId, doctorName, specialty);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MtpDoctorEntry &&
          other.id == this.id &&
          other.mtpDayId == this.mtpDayId &&
          other.doctorId == this.doctorId &&
          other.doctorName == this.doctorName &&
          other.specialty == this.specialty);
}

class MtpDoctorTableCompanion extends UpdateCompanion<MtpDoctorEntry> {
  final Value<int> id;
  final Value<int> mtpDayId;
  final Value<String> doctorId;
  final Value<String> doctorName;
  final Value<String> specialty;
  const MtpDoctorTableCompanion({
    this.id = const Value.absent(),
    this.mtpDayId = const Value.absent(),
    this.doctorId = const Value.absent(),
    this.doctorName = const Value.absent(),
    this.specialty = const Value.absent(),
  });
  MtpDoctorTableCompanion.insert({
    this.id = const Value.absent(),
    required int mtpDayId,
    required String doctorId,
    required String doctorName,
    required String specialty,
  })  : mtpDayId = Value(mtpDayId),
        doctorId = Value(doctorId),
        doctorName = Value(doctorName),
        specialty = Value(specialty);
  static Insertable<MtpDoctorEntry> custom({
    Expression<int>? id,
    Expression<int>? mtpDayId,
    Expression<String>? doctorId,
    Expression<String>? doctorName,
    Expression<String>? specialty,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (mtpDayId != null) 'mtp_day_id': mtpDayId,
      if (doctorId != null) 'doctor_id': doctorId,
      if (doctorName != null) 'doctor_name': doctorName,
      if (specialty != null) 'specialty': specialty,
    });
  }

  MtpDoctorTableCompanion copyWith(
      {Value<int>? id,
      Value<int>? mtpDayId,
      Value<String>? doctorId,
      Value<String>? doctorName,
      Value<String>? specialty}) {
    return MtpDoctorTableCompanion(
      id: id ?? this.id,
      mtpDayId: mtpDayId ?? this.mtpDayId,
      doctorId: doctorId ?? this.doctorId,
      doctorName: doctorName ?? this.doctorName,
      specialty: specialty ?? this.specialty,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (mtpDayId.present) {
      map['mtp_day_id'] = Variable<int>(mtpDayId.value);
    }
    if (doctorId.present) {
      map['doctor_id'] = Variable<String>(doctorId.value);
    }
    if (doctorName.present) {
      map['doctor_name'] = Variable<String>(doctorName.value);
    }
    if (specialty.present) {
      map['specialty'] = Variable<String>(specialty.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MtpDoctorTableCompanion(')
          ..write('id: $id, ')
          ..write('mtpDayId: $mtpDayId, ')
          ..write('doctorId: $doctorId, ')
          ..write('doctorName: $doctorName, ')
          ..write('specialty: $specialty')
          ..write(')'))
        .toString();
  }
}

class $OverrideRequestTableTable extends OverrideRequestTable
    with TableInfo<$OverrideRequestTableTable, OverrideRequestEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $OverrideRequestTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _employeeIdMeta =
      const VerificationMeta('employeeId');
  @override
  late final GeneratedColumn<String> employeeId = GeneratedColumn<String>(
      'employee_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerIdMeta =
      const VerificationMeta('customerId');
  @override
  late final GeneratedColumn<String> customerId = GeneratedColumn<String>(
      'customer_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _reasonMeta = const VerificationMeta('reason');
  @override
  late final GeneratedColumn<String> reason = GeneratedColumn<String>(
      'reason', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _noteMeta = const VerificationMeta('note');
  @override
  late final GeneratedColumn<String> note = GeneratedColumn<String>(
      'note', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _photoPathMeta =
      const VerificationMeta('photoPath');
  @override
  late final GeneratedColumn<String> photoPath = GeneratedColumn<String>(
      'photo_path', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _latitudeMeta =
      const VerificationMeta('latitude');
  @override
  late final GeneratedColumn<double> latitude = GeneratedColumn<double>(
      'latitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _longitudeMeta =
      const VerificationMeta('longitude');
  @override
  late final GeneratedColumn<double> longitude = GeneratedColumn<double>(
      'longitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _timestampMeta =
      const VerificationMeta('timestamp');
  @override
  late final GeneratedColumn<DateTime> timestamp = GeneratedColumn<DateTime>(
      'timestamp', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns => [
        id,
        employeeId,
        customerId,
        reason,
        note,
        photoPath,
        latitude,
        longitude,
        timestamp,
        syncStatus
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'override_request_table';
  @override
  VerificationContext validateIntegrity(
      Insertable<OverrideRequestEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('employee_id')) {
      context.handle(
          _employeeIdMeta,
          employeeId.isAcceptableOrUnknown(
              data['employee_id']!, _employeeIdMeta));
    } else if (isInserting) {
      context.missing(_employeeIdMeta);
    }
    if (data.containsKey('customer_id')) {
      context.handle(
          _customerIdMeta,
          customerId.isAcceptableOrUnknown(
              data['customer_id']!, _customerIdMeta));
    } else if (isInserting) {
      context.missing(_customerIdMeta);
    }
    if (data.containsKey('reason')) {
      context.handle(_reasonMeta,
          reason.isAcceptableOrUnknown(data['reason']!, _reasonMeta));
    } else if (isInserting) {
      context.missing(_reasonMeta);
    }
    if (data.containsKey('note')) {
      context.handle(
          _noteMeta, note.isAcceptableOrUnknown(data['note']!, _noteMeta));
    }
    if (data.containsKey('photo_path')) {
      context.handle(_photoPathMeta,
          photoPath.isAcceptableOrUnknown(data['photo_path']!, _photoPathMeta));
    }
    if (data.containsKey('latitude')) {
      context.handle(_latitudeMeta,
          latitude.isAcceptableOrUnknown(data['latitude']!, _latitudeMeta));
    } else if (isInserting) {
      context.missing(_latitudeMeta);
    }
    if (data.containsKey('longitude')) {
      context.handle(_longitudeMeta,
          longitude.isAcceptableOrUnknown(data['longitude']!, _longitudeMeta));
    } else if (isInserting) {
      context.missing(_longitudeMeta);
    }
    if (data.containsKey('timestamp')) {
      context.handle(_timestampMeta,
          timestamp.isAcceptableOrUnknown(data['timestamp']!, _timestampMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  OverrideRequestEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return OverrideRequestEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      employeeId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}employee_id'])!,
      customerId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_id'])!,
      reason: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}reason'])!,
      note: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}note']),
      photoPath: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}photo_path']),
      latitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}latitude'])!,
      longitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}longitude'])!,
      timestamp: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}timestamp'])!,
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $OverrideRequestTableTable createAlias(String alias) {
    return $OverrideRequestTableTable(attachedDatabase, alias);
  }
}

class OverrideRequestEntry extends DataClass
    implements Insertable<OverrideRequestEntry> {
  final int id;
  final String employeeId;
  final String customerId;
  final String reason;
  final String? note;
  final String? photoPath;
  final double latitude;
  final double longitude;
  final DateTime timestamp;
  final int syncStatus;
  const OverrideRequestEntry(
      {required this.id,
      required this.employeeId,
      required this.customerId,
      required this.reason,
      this.note,
      this.photoPath,
      required this.latitude,
      required this.longitude,
      required this.timestamp,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['employee_id'] = Variable<String>(employeeId);
    map['customer_id'] = Variable<String>(customerId);
    map['reason'] = Variable<String>(reason);
    if (!nullToAbsent || note != null) {
      map['note'] = Variable<String>(note);
    }
    if (!nullToAbsent || photoPath != null) {
      map['photo_path'] = Variable<String>(photoPath);
    }
    map['latitude'] = Variable<double>(latitude);
    map['longitude'] = Variable<double>(longitude);
    map['timestamp'] = Variable<DateTime>(timestamp);
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  OverrideRequestTableCompanion toCompanion(bool nullToAbsent) {
    return OverrideRequestTableCompanion(
      id: Value(id),
      employeeId: Value(employeeId),
      customerId: Value(customerId),
      reason: Value(reason),
      note: note == null && nullToAbsent ? const Value.absent() : Value(note),
      photoPath: photoPath == null && nullToAbsent
          ? const Value.absent()
          : Value(photoPath),
      latitude: Value(latitude),
      longitude: Value(longitude),
      timestamp: Value(timestamp),
      syncStatus: Value(syncStatus),
    );
  }

  factory OverrideRequestEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return OverrideRequestEntry(
      id: serializer.fromJson<int>(json['id']),
      employeeId: serializer.fromJson<String>(json['employeeId']),
      customerId: serializer.fromJson<String>(json['customerId']),
      reason: serializer.fromJson<String>(json['reason']),
      note: serializer.fromJson<String?>(json['note']),
      photoPath: serializer.fromJson<String?>(json['photoPath']),
      latitude: serializer.fromJson<double>(json['latitude']),
      longitude: serializer.fromJson<double>(json['longitude']),
      timestamp: serializer.fromJson<DateTime>(json['timestamp']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'employeeId': serializer.toJson<String>(employeeId),
      'customerId': serializer.toJson<String>(customerId),
      'reason': serializer.toJson<String>(reason),
      'note': serializer.toJson<String?>(note),
      'photoPath': serializer.toJson<String?>(photoPath),
      'latitude': serializer.toJson<double>(latitude),
      'longitude': serializer.toJson<double>(longitude),
      'timestamp': serializer.toJson<DateTime>(timestamp),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  OverrideRequestEntry copyWith(
          {int? id,
          String? employeeId,
          String? customerId,
          String? reason,
          Value<String?> note = const Value.absent(),
          Value<String?> photoPath = const Value.absent(),
          double? latitude,
          double? longitude,
          DateTime? timestamp,
          int? syncStatus}) =>
      OverrideRequestEntry(
        id: id ?? this.id,
        employeeId: employeeId ?? this.employeeId,
        customerId: customerId ?? this.customerId,
        reason: reason ?? this.reason,
        note: note.present ? note.value : this.note,
        photoPath: photoPath.present ? photoPath.value : this.photoPath,
        latitude: latitude ?? this.latitude,
        longitude: longitude ?? this.longitude,
        timestamp: timestamp ?? this.timestamp,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  OverrideRequestEntry copyWithCompanion(OverrideRequestTableCompanion data) {
    return OverrideRequestEntry(
      id: data.id.present ? data.id.value : this.id,
      employeeId:
          data.employeeId.present ? data.employeeId.value : this.employeeId,
      customerId:
          data.customerId.present ? data.customerId.value : this.customerId,
      reason: data.reason.present ? data.reason.value : this.reason,
      note: data.note.present ? data.note.value : this.note,
      photoPath: data.photoPath.present ? data.photoPath.value : this.photoPath,
      latitude: data.latitude.present ? data.latitude.value : this.latitude,
      longitude: data.longitude.present ? data.longitude.value : this.longitude,
      timestamp: data.timestamp.present ? data.timestamp.value : this.timestamp,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('OverrideRequestEntry(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('customerId: $customerId, ')
          ..write('reason: $reason, ')
          ..write('note: $note, ')
          ..write('photoPath: $photoPath, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('timestamp: $timestamp, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, employeeId, customerId, reason, note,
      photoPath, latitude, longitude, timestamp, syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is OverrideRequestEntry &&
          other.id == this.id &&
          other.employeeId == this.employeeId &&
          other.customerId == this.customerId &&
          other.reason == this.reason &&
          other.note == this.note &&
          other.photoPath == this.photoPath &&
          other.latitude == this.latitude &&
          other.longitude == this.longitude &&
          other.timestamp == this.timestamp &&
          other.syncStatus == this.syncStatus);
}

class OverrideRequestTableCompanion
    extends UpdateCompanion<OverrideRequestEntry> {
  final Value<int> id;
  final Value<String> employeeId;
  final Value<String> customerId;
  final Value<String> reason;
  final Value<String?> note;
  final Value<String?> photoPath;
  final Value<double> latitude;
  final Value<double> longitude;
  final Value<DateTime> timestamp;
  final Value<int> syncStatus;
  const OverrideRequestTableCompanion({
    this.id = const Value.absent(),
    this.employeeId = const Value.absent(),
    this.customerId = const Value.absent(),
    this.reason = const Value.absent(),
    this.note = const Value.absent(),
    this.photoPath = const Value.absent(),
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.timestamp = const Value.absent(),
    this.syncStatus = const Value.absent(),
  });
  OverrideRequestTableCompanion.insert({
    this.id = const Value.absent(),
    required String employeeId,
    required String customerId,
    required String reason,
    this.note = const Value.absent(),
    this.photoPath = const Value.absent(),
    required double latitude,
    required double longitude,
    this.timestamp = const Value.absent(),
    this.syncStatus = const Value.absent(),
  })  : employeeId = Value(employeeId),
        customerId = Value(customerId),
        reason = Value(reason),
        latitude = Value(latitude),
        longitude = Value(longitude);
  static Insertable<OverrideRequestEntry> custom({
    Expression<int>? id,
    Expression<String>? employeeId,
    Expression<String>? customerId,
    Expression<String>? reason,
    Expression<String>? note,
    Expression<String>? photoPath,
    Expression<double>? latitude,
    Expression<double>? longitude,
    Expression<DateTime>? timestamp,
    Expression<int>? syncStatus,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (employeeId != null) 'employee_id': employeeId,
      if (customerId != null) 'customer_id': customerId,
      if (reason != null) 'reason': reason,
      if (note != null) 'note': note,
      if (photoPath != null) 'photo_path': photoPath,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (timestamp != null) 'timestamp': timestamp,
      if (syncStatus != null) 'sync_status': syncStatus,
    });
  }

  OverrideRequestTableCompanion copyWith(
      {Value<int>? id,
      Value<String>? employeeId,
      Value<String>? customerId,
      Value<String>? reason,
      Value<String?>? note,
      Value<String?>? photoPath,
      Value<double>? latitude,
      Value<double>? longitude,
      Value<DateTime>? timestamp,
      Value<int>? syncStatus}) {
    return OverrideRequestTableCompanion(
      id: id ?? this.id,
      employeeId: employeeId ?? this.employeeId,
      customerId: customerId ?? this.customerId,
      reason: reason ?? this.reason,
      note: note ?? this.note,
      photoPath: photoPath ?? this.photoPath,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      timestamp: timestamp ?? this.timestamp,
      syncStatus: syncStatus ?? this.syncStatus,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (employeeId.present) {
      map['employee_id'] = Variable<String>(employeeId.value);
    }
    if (customerId.present) {
      map['customer_id'] = Variable<String>(customerId.value);
    }
    if (reason.present) {
      map['reason'] = Variable<String>(reason.value);
    }
    if (note.present) {
      map['note'] = Variable<String>(note.value);
    }
    if (photoPath.present) {
      map['photo_path'] = Variable<String>(photoPath.value);
    }
    if (latitude.present) {
      map['latitude'] = Variable<double>(latitude.value);
    }
    if (longitude.present) {
      map['longitude'] = Variable<double>(longitude.value);
    }
    if (timestamp.present) {
      map['timestamp'] = Variable<DateTime>(timestamp.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('OverrideRequestTableCompanion(')
          ..write('id: $id, ')
          ..write('employeeId: $employeeId, ')
          ..write('customerId: $customerId, ')
          ..write('reason: $reason, ')
          ..write('note: $note, ')
          ..write('photoPath: $photoPath, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('timestamp: $timestamp, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }
}

class $ProductTableTable extends ProductTable
    with TableInfo<$ProductTableTable, ProductEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ProductTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
      'name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _strengthMeta =
      const VerificationMeta('strength');
  @override
  late final GeneratedColumn<String> strength = GeneratedColumn<String>(
      'strength', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _packMeta = const VerificationMeta('pack');
  @override
  late final GeneratedColumn<String> pack = GeneratedColumn<String>(
      'pack', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _availableStockMeta =
      const VerificationMeta('availableStock');
  @override
  late final GeneratedColumn<int> availableStock = GeneratedColumn<int>(
      'available_stock', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _priceMeta = const VerificationMeta('price');
  @override
  late final GeneratedColumn<double> price = GeneratedColumn<double>(
      'price', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  @override
  List<GeneratedColumn> get $columns =>
      [id, name, strength, pack, availableStock, price];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'product_table';
  @override
  VerificationContext validateIntegrity(Insertable<ProductEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
          _nameMeta, name.isAcceptableOrUnknown(data['name']!, _nameMeta));
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('strength')) {
      context.handle(_strengthMeta,
          strength.isAcceptableOrUnknown(data['strength']!, _strengthMeta));
    }
    if (data.containsKey('pack')) {
      context.handle(
          _packMeta, pack.isAcceptableOrUnknown(data['pack']!, _packMeta));
    }
    if (data.containsKey('available_stock')) {
      context.handle(
          _availableStockMeta,
          availableStock.isAcceptableOrUnknown(
              data['available_stock']!, _availableStockMeta));
    }
    if (data.containsKey('price')) {
      context.handle(
          _priceMeta, price.isAcceptableOrUnknown(data['price']!, _priceMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  ProductEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ProductEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      name: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}name'])!,
      strength: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}strength']),
      pack: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}pack']),
      availableStock: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}available_stock'])!,
      price: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}price']),
    );
  }

  @override
  $ProductTableTable createAlias(String alias) {
    return $ProductTableTable(attachedDatabase, alias);
  }
}

class ProductEntry extends DataClass implements Insertable<ProductEntry> {
  final String id;
  final String name;
  final String? strength;
  final String? pack;
  final int availableStock;
  final double? price;
  const ProductEntry(
      {required this.id,
      required this.name,
      this.strength,
      this.pack,
      required this.availableStock,
      this.price});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    if (!nullToAbsent || strength != null) {
      map['strength'] = Variable<String>(strength);
    }
    if (!nullToAbsent || pack != null) {
      map['pack'] = Variable<String>(pack);
    }
    map['available_stock'] = Variable<int>(availableStock);
    if (!nullToAbsent || price != null) {
      map['price'] = Variable<double>(price);
    }
    return map;
  }

  ProductTableCompanion toCompanion(bool nullToAbsent) {
    return ProductTableCompanion(
      id: Value(id),
      name: Value(name),
      strength: strength == null && nullToAbsent
          ? const Value.absent()
          : Value(strength),
      pack: pack == null && nullToAbsent ? const Value.absent() : Value(pack),
      availableStock: Value(availableStock),
      price:
          price == null && nullToAbsent ? const Value.absent() : Value(price),
    );
  }

  factory ProductEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ProductEntry(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      strength: serializer.fromJson<String?>(json['strength']),
      pack: serializer.fromJson<String?>(json['pack']),
      availableStock: serializer.fromJson<int>(json['availableStock']),
      price: serializer.fromJson<double?>(json['price']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'strength': serializer.toJson<String?>(strength),
      'pack': serializer.toJson<String?>(pack),
      'availableStock': serializer.toJson<int>(availableStock),
      'price': serializer.toJson<double?>(price),
    };
  }

  ProductEntry copyWith(
          {String? id,
          String? name,
          Value<String?> strength = const Value.absent(),
          Value<String?> pack = const Value.absent(),
          int? availableStock,
          Value<double?> price = const Value.absent()}) =>
      ProductEntry(
        id: id ?? this.id,
        name: name ?? this.name,
        strength: strength.present ? strength.value : this.strength,
        pack: pack.present ? pack.value : this.pack,
        availableStock: availableStock ?? this.availableStock,
        price: price.present ? price.value : this.price,
      );
  ProductEntry copyWithCompanion(ProductTableCompanion data) {
    return ProductEntry(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      strength: data.strength.present ? data.strength.value : this.strength,
      pack: data.pack.present ? data.pack.value : this.pack,
      availableStock: data.availableStock.present
          ? data.availableStock.value
          : this.availableStock,
      price: data.price.present ? data.price.value : this.price,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ProductEntry(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('strength: $strength, ')
          ..write('pack: $pack, ')
          ..write('availableStock: $availableStock, ')
          ..write('price: $price')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, name, strength, pack, availableStock, price);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ProductEntry &&
          other.id == this.id &&
          other.name == this.name &&
          other.strength == this.strength &&
          other.pack == this.pack &&
          other.availableStock == this.availableStock &&
          other.price == this.price);
}

class ProductTableCompanion extends UpdateCompanion<ProductEntry> {
  final Value<String> id;
  final Value<String> name;
  final Value<String?> strength;
  final Value<String?> pack;
  final Value<int> availableStock;
  final Value<double?> price;
  final Value<int> rowid;
  const ProductTableCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.strength = const Value.absent(),
    this.pack = const Value.absent(),
    this.availableStock = const Value.absent(),
    this.price = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ProductTableCompanion.insert({
    required String id,
    required String name,
    this.strength = const Value.absent(),
    this.pack = const Value.absent(),
    this.availableStock = const Value.absent(),
    this.price = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        name = Value(name);
  static Insertable<ProductEntry> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<String>? strength,
    Expression<String>? pack,
    Expression<int>? availableStock,
    Expression<double>? price,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (strength != null) 'strength': strength,
      if (pack != null) 'pack': pack,
      if (availableStock != null) 'available_stock': availableStock,
      if (price != null) 'price': price,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ProductTableCompanion copyWith(
      {Value<String>? id,
      Value<String>? name,
      Value<String?>? strength,
      Value<String?>? pack,
      Value<int>? availableStock,
      Value<double?>? price,
      Value<int>? rowid}) {
    return ProductTableCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      strength: strength ?? this.strength,
      pack: pack ?? this.pack,
      availableStock: availableStock ?? this.availableStock,
      price: price ?? this.price,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (strength.present) {
      map['strength'] = Variable<String>(strength.value);
    }
    if (pack.present) {
      map['pack'] = Variable<String>(pack.value);
    }
    if (availableStock.present) {
      map['available_stock'] = Variable<int>(availableStock.value);
    }
    if (price.present) {
      map['price'] = Variable<double>(price.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ProductTableCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('strength: $strength, ')
          ..write('pack: $pack, ')
          ..write('availableStock: $availableStock, ')
          ..write('price: $price, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $SecondarySalesProductTableTable extends SecondarySalesProductTable
    with
        TableInfo<$SecondarySalesProductTableTable,
            SecondarySalesProductEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $SecondarySalesProductTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _salesIdMeta =
      const VerificationMeta('salesId');
  @override
  late final GeneratedColumn<String> salesId = GeneratedColumn<String>(
      'sales_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _productIdMeta =
      const VerificationMeta('productId');
  @override
  late final GeneratedColumn<String> productId = GeneratedColumn<String>(
      'product_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _productNameMeta =
      const VerificationMeta('productName');
  @override
  late final GeneratedColumn<String> productName = GeneratedColumn<String>(
      'product_name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _packMeta = const VerificationMeta('pack');
  @override
  late final GeneratedColumn<String> pack = GeneratedColumn<String>(
      'pack', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _strengthMeta =
      const VerificationMeta('strength');
  @override
  late final GeneratedColumn<String> strength = GeneratedColumn<String>(
      'strength', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _unitMeta = const VerificationMeta('unit');
  @override
  late final GeneratedColumn<String> unit = GeneratedColumn<String>(
      'unit', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _openingStockMeta =
      const VerificationMeta('openingStock');
  @override
  late final GeneratedColumn<int> openingStock = GeneratedColumn<int>(
      'opening_stock', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _purchaseQtyMeta =
      const VerificationMeta('purchaseQty');
  @override
  late final GeneratedColumn<int> purchaseQty = GeneratedColumn<int>(
      'purchase_qty', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _salesQtyMeta =
      const VerificationMeta('salesQty');
  @override
  late final GeneratedColumn<int> salesQty = GeneratedColumn<int>(
      'sales_qty', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _closingStockMeta =
      const VerificationMeta('closingStock');
  @override
  late final GeneratedColumn<int> closingStock = GeneratedColumn<int>(
      'closing_stock', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _freeQtyMeta =
      const VerificationMeta('freeQty');
  @override
  late final GeneratedColumn<int> freeQty = GeneratedColumn<int>(
      'free_qty', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _returnedQtyMeta =
      const VerificationMeta('returnedQty');
  @override
  late final GeneratedColumn<int> returnedQty = GeneratedColumn<int>(
      'returned_qty', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _damageQtyMeta =
      const VerificationMeta('damageQty');
  @override
  late final GeneratedColumn<int> damageQty = GeneratedColumn<int>(
      'damage_qty', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _unitPriceMeta =
      const VerificationMeta('unitPrice');
  @override
  late final GeneratedColumn<double> unitPrice = GeneratedColumn<double>(
      'unit_price', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0.0));
  @override
  List<GeneratedColumn> get $columns => [
        id,
        salesId,
        productId,
        productName,
        pack,
        strength,
        unit,
        openingStock,
        purchaseQty,
        salesQty,
        closingStock,
        freeQty,
        returnedQty,
        damageQty,
        unitPrice
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'secondary_sales_product_table';
  @override
  VerificationContext validateIntegrity(
      Insertable<SecondarySalesProductEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('sales_id')) {
      context.handle(_salesIdMeta,
          salesId.isAcceptableOrUnknown(data['sales_id']!, _salesIdMeta));
    } else if (isInserting) {
      context.missing(_salesIdMeta);
    }
    if (data.containsKey('product_id')) {
      context.handle(_productIdMeta,
          productId.isAcceptableOrUnknown(data['product_id']!, _productIdMeta));
    } else if (isInserting) {
      context.missing(_productIdMeta);
    }
    if (data.containsKey('product_name')) {
      context.handle(
          _productNameMeta,
          productName.isAcceptableOrUnknown(
              data['product_name']!, _productNameMeta));
    } else if (isInserting) {
      context.missing(_productNameMeta);
    }
    if (data.containsKey('pack')) {
      context.handle(
          _packMeta, pack.isAcceptableOrUnknown(data['pack']!, _packMeta));
    } else if (isInserting) {
      context.missing(_packMeta);
    }
    if (data.containsKey('strength')) {
      context.handle(_strengthMeta,
          strength.isAcceptableOrUnknown(data['strength']!, _strengthMeta));
    } else if (isInserting) {
      context.missing(_strengthMeta);
    }
    if (data.containsKey('unit')) {
      context.handle(
          _unitMeta, unit.isAcceptableOrUnknown(data['unit']!, _unitMeta));
    } else if (isInserting) {
      context.missing(_unitMeta);
    }
    if (data.containsKey('opening_stock')) {
      context.handle(
          _openingStockMeta,
          openingStock.isAcceptableOrUnknown(
              data['opening_stock']!, _openingStockMeta));
    }
    if (data.containsKey('purchase_qty')) {
      context.handle(
          _purchaseQtyMeta,
          purchaseQty.isAcceptableOrUnknown(
              data['purchase_qty']!, _purchaseQtyMeta));
    }
    if (data.containsKey('sales_qty')) {
      context.handle(_salesQtyMeta,
          salesQty.isAcceptableOrUnknown(data['sales_qty']!, _salesQtyMeta));
    }
    if (data.containsKey('closing_stock')) {
      context.handle(
          _closingStockMeta,
          closingStock.isAcceptableOrUnknown(
              data['closing_stock']!, _closingStockMeta));
    }
    if (data.containsKey('free_qty')) {
      context.handle(_freeQtyMeta,
          freeQty.isAcceptableOrUnknown(data['free_qty']!, _freeQtyMeta));
    }
    if (data.containsKey('returned_qty')) {
      context.handle(
          _returnedQtyMeta,
          returnedQty.isAcceptableOrUnknown(
              data['returned_qty']!, _returnedQtyMeta));
    }
    if (data.containsKey('damage_qty')) {
      context.handle(_damageQtyMeta,
          damageQty.isAcceptableOrUnknown(data['damage_qty']!, _damageQtyMeta));
    }
    if (data.containsKey('unit_price')) {
      context.handle(_unitPriceMeta,
          unitPrice.isAcceptableOrUnknown(data['unit_price']!, _unitPriceMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  SecondarySalesProductEntry map(Map<String, dynamic> data,
      {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return SecondarySalesProductEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      salesId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}sales_id'])!,
      productId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}product_id'])!,
      productName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}product_name'])!,
      pack: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}pack'])!,
      strength: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}strength'])!,
      unit: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}unit'])!,
      openingStock: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}opening_stock'])!,
      purchaseQty: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}purchase_qty'])!,
      salesQty: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sales_qty'])!,
      closingStock: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}closing_stock'])!,
      freeQty: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}free_qty'])!,
      returnedQty: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}returned_qty'])!,
      damageQty: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}damage_qty'])!,
      unitPrice: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}unit_price'])!,
    );
  }

  @override
  $SecondarySalesProductTableTable createAlias(String alias) {
    return $SecondarySalesProductTableTable(attachedDatabase, alias);
  }
}

class SecondarySalesProductEntry extends DataClass
    implements Insertable<SecondarySalesProductEntry> {
  final String id;
  final String salesId;
  final String productId;
  final String productName;
  final String pack;
  final String strength;
  final String unit;
  final int openingStock;
  final int purchaseQty;
  final int salesQty;
  final int closingStock;
  final int freeQty;
  final int returnedQty;
  final int damageQty;
  final double unitPrice;
  const SecondarySalesProductEntry(
      {required this.id,
      required this.salesId,
      required this.productId,
      required this.productName,
      required this.pack,
      required this.strength,
      required this.unit,
      required this.openingStock,
      required this.purchaseQty,
      required this.salesQty,
      required this.closingStock,
      required this.freeQty,
      required this.returnedQty,
      required this.damageQty,
      required this.unitPrice});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['sales_id'] = Variable<String>(salesId);
    map['product_id'] = Variable<String>(productId);
    map['product_name'] = Variable<String>(productName);
    map['pack'] = Variable<String>(pack);
    map['strength'] = Variable<String>(strength);
    map['unit'] = Variable<String>(unit);
    map['opening_stock'] = Variable<int>(openingStock);
    map['purchase_qty'] = Variable<int>(purchaseQty);
    map['sales_qty'] = Variable<int>(salesQty);
    map['closing_stock'] = Variable<int>(closingStock);
    map['free_qty'] = Variable<int>(freeQty);
    map['returned_qty'] = Variable<int>(returnedQty);
    map['damage_qty'] = Variable<int>(damageQty);
    map['unit_price'] = Variable<double>(unitPrice);
    return map;
  }

  SecondarySalesProductTableCompanion toCompanion(bool nullToAbsent) {
    return SecondarySalesProductTableCompanion(
      id: Value(id),
      salesId: Value(salesId),
      productId: Value(productId),
      productName: Value(productName),
      pack: Value(pack),
      strength: Value(strength),
      unit: Value(unit),
      openingStock: Value(openingStock),
      purchaseQty: Value(purchaseQty),
      salesQty: Value(salesQty),
      closingStock: Value(closingStock),
      freeQty: Value(freeQty),
      returnedQty: Value(returnedQty),
      damageQty: Value(damageQty),
      unitPrice: Value(unitPrice),
    );
  }

  factory SecondarySalesProductEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return SecondarySalesProductEntry(
      id: serializer.fromJson<String>(json['id']),
      salesId: serializer.fromJson<String>(json['salesId']),
      productId: serializer.fromJson<String>(json['productId']),
      productName: serializer.fromJson<String>(json['productName']),
      pack: serializer.fromJson<String>(json['pack']),
      strength: serializer.fromJson<String>(json['strength']),
      unit: serializer.fromJson<String>(json['unit']),
      openingStock: serializer.fromJson<int>(json['openingStock']),
      purchaseQty: serializer.fromJson<int>(json['purchaseQty']),
      salesQty: serializer.fromJson<int>(json['salesQty']),
      closingStock: serializer.fromJson<int>(json['closingStock']),
      freeQty: serializer.fromJson<int>(json['freeQty']),
      returnedQty: serializer.fromJson<int>(json['returnedQty']),
      damageQty: serializer.fromJson<int>(json['damageQty']),
      unitPrice: serializer.fromJson<double>(json['unitPrice']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'salesId': serializer.toJson<String>(salesId),
      'productId': serializer.toJson<String>(productId),
      'productName': serializer.toJson<String>(productName),
      'pack': serializer.toJson<String>(pack),
      'strength': serializer.toJson<String>(strength),
      'unit': serializer.toJson<String>(unit),
      'openingStock': serializer.toJson<int>(openingStock),
      'purchaseQty': serializer.toJson<int>(purchaseQty),
      'salesQty': serializer.toJson<int>(salesQty),
      'closingStock': serializer.toJson<int>(closingStock),
      'freeQty': serializer.toJson<int>(freeQty),
      'returnedQty': serializer.toJson<int>(returnedQty),
      'damageQty': serializer.toJson<int>(damageQty),
      'unitPrice': serializer.toJson<double>(unitPrice),
    };
  }

  SecondarySalesProductEntry copyWith(
          {String? id,
          String? salesId,
          String? productId,
          String? productName,
          String? pack,
          String? strength,
          String? unit,
          int? openingStock,
          int? purchaseQty,
          int? salesQty,
          int? closingStock,
          int? freeQty,
          int? returnedQty,
          int? damageQty,
          double? unitPrice}) =>
      SecondarySalesProductEntry(
        id: id ?? this.id,
        salesId: salesId ?? this.salesId,
        productId: productId ?? this.productId,
        productName: productName ?? this.productName,
        pack: pack ?? this.pack,
        strength: strength ?? this.strength,
        unit: unit ?? this.unit,
        openingStock: openingStock ?? this.openingStock,
        purchaseQty: purchaseQty ?? this.purchaseQty,
        salesQty: salesQty ?? this.salesQty,
        closingStock: closingStock ?? this.closingStock,
        freeQty: freeQty ?? this.freeQty,
        returnedQty: returnedQty ?? this.returnedQty,
        damageQty: damageQty ?? this.damageQty,
        unitPrice: unitPrice ?? this.unitPrice,
      );
  SecondarySalesProductEntry copyWithCompanion(
      SecondarySalesProductTableCompanion data) {
    return SecondarySalesProductEntry(
      id: data.id.present ? data.id.value : this.id,
      salesId: data.salesId.present ? data.salesId.value : this.salesId,
      productId: data.productId.present ? data.productId.value : this.productId,
      productName:
          data.productName.present ? data.productName.value : this.productName,
      pack: data.pack.present ? data.pack.value : this.pack,
      strength: data.strength.present ? data.strength.value : this.strength,
      unit: data.unit.present ? data.unit.value : this.unit,
      openingStock: data.openingStock.present
          ? data.openingStock.value
          : this.openingStock,
      purchaseQty:
          data.purchaseQty.present ? data.purchaseQty.value : this.purchaseQty,
      salesQty: data.salesQty.present ? data.salesQty.value : this.salesQty,
      closingStock: data.closingStock.present
          ? data.closingStock.value
          : this.closingStock,
      freeQty: data.freeQty.present ? data.freeQty.value : this.freeQty,
      returnedQty:
          data.returnedQty.present ? data.returnedQty.value : this.returnedQty,
      damageQty: data.damageQty.present ? data.damageQty.value : this.damageQty,
      unitPrice: data.unitPrice.present ? data.unitPrice.value : this.unitPrice,
    );
  }

  @override
  String toString() {
    return (StringBuffer('SecondarySalesProductEntry(')
          ..write('id: $id, ')
          ..write('salesId: $salesId, ')
          ..write('productId: $productId, ')
          ..write('productName: $productName, ')
          ..write('pack: $pack, ')
          ..write('strength: $strength, ')
          ..write('unit: $unit, ')
          ..write('openingStock: $openingStock, ')
          ..write('purchaseQty: $purchaseQty, ')
          ..write('salesQty: $salesQty, ')
          ..write('closingStock: $closingStock, ')
          ..write('freeQty: $freeQty, ')
          ..write('returnedQty: $returnedQty, ')
          ..write('damageQty: $damageQty, ')
          ..write('unitPrice: $unitPrice')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      salesId,
      productId,
      productName,
      pack,
      strength,
      unit,
      openingStock,
      purchaseQty,
      salesQty,
      closingStock,
      freeQty,
      returnedQty,
      damageQty,
      unitPrice);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is SecondarySalesProductEntry &&
          other.id == this.id &&
          other.salesId == this.salesId &&
          other.productId == this.productId &&
          other.productName == this.productName &&
          other.pack == this.pack &&
          other.strength == this.strength &&
          other.unit == this.unit &&
          other.openingStock == this.openingStock &&
          other.purchaseQty == this.purchaseQty &&
          other.salesQty == this.salesQty &&
          other.closingStock == this.closingStock &&
          other.freeQty == this.freeQty &&
          other.returnedQty == this.returnedQty &&
          other.damageQty == this.damageQty &&
          other.unitPrice == this.unitPrice);
}

class SecondarySalesProductTableCompanion
    extends UpdateCompanion<SecondarySalesProductEntry> {
  final Value<String> id;
  final Value<String> salesId;
  final Value<String> productId;
  final Value<String> productName;
  final Value<String> pack;
  final Value<String> strength;
  final Value<String> unit;
  final Value<int> openingStock;
  final Value<int> purchaseQty;
  final Value<int> salesQty;
  final Value<int> closingStock;
  final Value<int> freeQty;
  final Value<int> returnedQty;
  final Value<int> damageQty;
  final Value<double> unitPrice;
  final Value<int> rowid;
  const SecondarySalesProductTableCompanion({
    this.id = const Value.absent(),
    this.salesId = const Value.absent(),
    this.productId = const Value.absent(),
    this.productName = const Value.absent(),
    this.pack = const Value.absent(),
    this.strength = const Value.absent(),
    this.unit = const Value.absent(),
    this.openingStock = const Value.absent(),
    this.purchaseQty = const Value.absent(),
    this.salesQty = const Value.absent(),
    this.closingStock = const Value.absent(),
    this.freeQty = const Value.absent(),
    this.returnedQty = const Value.absent(),
    this.damageQty = const Value.absent(),
    this.unitPrice = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  SecondarySalesProductTableCompanion.insert({
    required String id,
    required String salesId,
    required String productId,
    required String productName,
    required String pack,
    required String strength,
    required String unit,
    this.openingStock = const Value.absent(),
    this.purchaseQty = const Value.absent(),
    this.salesQty = const Value.absent(),
    this.closingStock = const Value.absent(),
    this.freeQty = const Value.absent(),
    this.returnedQty = const Value.absent(),
    this.damageQty = const Value.absent(),
    this.unitPrice = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        salesId = Value(salesId),
        productId = Value(productId),
        productName = Value(productName),
        pack = Value(pack),
        strength = Value(strength),
        unit = Value(unit);
  static Insertable<SecondarySalesProductEntry> custom({
    Expression<String>? id,
    Expression<String>? salesId,
    Expression<String>? productId,
    Expression<String>? productName,
    Expression<String>? pack,
    Expression<String>? strength,
    Expression<String>? unit,
    Expression<int>? openingStock,
    Expression<int>? purchaseQty,
    Expression<int>? salesQty,
    Expression<int>? closingStock,
    Expression<int>? freeQty,
    Expression<int>? returnedQty,
    Expression<int>? damageQty,
    Expression<double>? unitPrice,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (salesId != null) 'sales_id': salesId,
      if (productId != null) 'product_id': productId,
      if (productName != null) 'product_name': productName,
      if (pack != null) 'pack': pack,
      if (strength != null) 'strength': strength,
      if (unit != null) 'unit': unit,
      if (openingStock != null) 'opening_stock': openingStock,
      if (purchaseQty != null) 'purchase_qty': purchaseQty,
      if (salesQty != null) 'sales_qty': salesQty,
      if (closingStock != null) 'closing_stock': closingStock,
      if (freeQty != null) 'free_qty': freeQty,
      if (returnedQty != null) 'returned_qty': returnedQty,
      if (damageQty != null) 'damage_qty': damageQty,
      if (unitPrice != null) 'unit_price': unitPrice,
      if (rowid != null) 'rowid': rowid,
    });
  }

  SecondarySalesProductTableCompanion copyWith(
      {Value<String>? id,
      Value<String>? salesId,
      Value<String>? productId,
      Value<String>? productName,
      Value<String>? pack,
      Value<String>? strength,
      Value<String>? unit,
      Value<int>? openingStock,
      Value<int>? purchaseQty,
      Value<int>? salesQty,
      Value<int>? closingStock,
      Value<int>? freeQty,
      Value<int>? returnedQty,
      Value<int>? damageQty,
      Value<double>? unitPrice,
      Value<int>? rowid}) {
    return SecondarySalesProductTableCompanion(
      id: id ?? this.id,
      salesId: salesId ?? this.salesId,
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      pack: pack ?? this.pack,
      strength: strength ?? this.strength,
      unit: unit ?? this.unit,
      openingStock: openingStock ?? this.openingStock,
      purchaseQty: purchaseQty ?? this.purchaseQty,
      salesQty: salesQty ?? this.salesQty,
      closingStock: closingStock ?? this.closingStock,
      freeQty: freeQty ?? this.freeQty,
      returnedQty: returnedQty ?? this.returnedQty,
      damageQty: damageQty ?? this.damageQty,
      unitPrice: unitPrice ?? this.unitPrice,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (salesId.present) {
      map['sales_id'] = Variable<String>(salesId.value);
    }
    if (productId.present) {
      map['product_id'] = Variable<String>(productId.value);
    }
    if (productName.present) {
      map['product_name'] = Variable<String>(productName.value);
    }
    if (pack.present) {
      map['pack'] = Variable<String>(pack.value);
    }
    if (strength.present) {
      map['strength'] = Variable<String>(strength.value);
    }
    if (unit.present) {
      map['unit'] = Variable<String>(unit.value);
    }
    if (openingStock.present) {
      map['opening_stock'] = Variable<int>(openingStock.value);
    }
    if (purchaseQty.present) {
      map['purchase_qty'] = Variable<int>(purchaseQty.value);
    }
    if (salesQty.present) {
      map['sales_qty'] = Variable<int>(salesQty.value);
    }
    if (closingStock.present) {
      map['closing_stock'] = Variable<int>(closingStock.value);
    }
    if (freeQty.present) {
      map['free_qty'] = Variable<int>(freeQty.value);
    }
    if (returnedQty.present) {
      map['returned_qty'] = Variable<int>(returnedQty.value);
    }
    if (damageQty.present) {
      map['damage_qty'] = Variable<int>(damageQty.value);
    }
    if (unitPrice.present) {
      map['unit_price'] = Variable<double>(unitPrice.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('SecondarySalesProductTableCompanion(')
          ..write('id: $id, ')
          ..write('salesId: $salesId, ')
          ..write('productId: $productId, ')
          ..write('productName: $productName, ')
          ..write('pack: $pack, ')
          ..write('strength: $strength, ')
          ..write('unit: $unit, ')
          ..write('openingStock: $openingStock, ')
          ..write('purchaseQty: $purchaseQty, ')
          ..write('salesQty: $salesQty, ')
          ..write('closingStock: $closingStock, ')
          ..write('freeQty: $freeQty, ')
          ..write('returnedQty: $returnedQty, ')
          ..write('damageQty: $damageQty, ')
          ..write('unitPrice: $unitPrice, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $SecondarySalesTableTable extends SecondarySalesTable
    with TableInfo<$SecondarySalesTableTable, SecondarySalesEntry> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $SecondarySalesTableTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerIdMeta =
      const VerificationMeta('customerId');
  @override
  late final GeneratedColumn<String> customerId = GeneratedColumn<String>(
      'customer_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerNameMeta =
      const VerificationMeta('customerName');
  @override
  late final GeneratedColumn<String> customerName = GeneratedColumn<String>(
      'customer_name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerTypeMeta =
      const VerificationMeta('customerType');
  @override
  late final GeneratedColumn<String> customerType = GeneratedColumn<String>(
      'customer_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _entryTypeMeta =
      const VerificationMeta('entryType');
  @override
  late final GeneratedColumn<String> entryType = GeneratedColumn<String>(
      'entry_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _entryDateMeta =
      const VerificationMeta('entryDate');
  @override
  late final GeneratedColumn<DateTime> entryDate = GeneratedColumn<DateTime>(
      'entry_date', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _totalSalesValueMeta =
      const VerificationMeta('totalSalesValue');
  @override
  late final GeneratedColumn<double> totalSalesValue = GeneratedColumn<double>(
      'total_sales_value', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0.0));
  static const VerificationMeta _totalStockValueMeta =
      const VerificationMeta('totalStockValue');
  @override
  late final GeneratedColumn<double> totalStockValue = GeneratedColumn<double>(
      'total_stock_value', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0.0));
  static const VerificationMeta _totalSalesQtyMeta =
      const VerificationMeta('totalSalesQty');
  @override
  late final GeneratedColumn<int> totalSalesQty = GeneratedColumn<int>(
      'total_sales_qty', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _totalClosingStockMeta =
      const VerificationMeta('totalClosingStock');
  @override
  late final GeneratedColumn<int> totalClosingStock = GeneratedColumn<int>(
      'total_closing_stock', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
      'status', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('Pending'));
  static const VerificationMeta _managerRemarksMeta =
      const VerificationMeta('managerRemarks');
  @override
  late final GeneratedColumn<String> managerRemarks = GeneratedColumn<String>(
      'manager_remarks', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _syncStatusMeta =
      const VerificationMeta('syncStatus');
  @override
  late final GeneratedColumn<int> syncStatus = GeneratedColumn<int>(
      'sync_status', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns => [
        id,
        customerId,
        customerName,
        customerType,
        entryType,
        entryDate,
        totalSalesValue,
        totalStockValue,
        totalSalesQty,
        totalClosingStock,
        status,
        managerRemarks,
        syncStatus
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'secondary_sales_table';
  @override
  VerificationContext validateIntegrity(
      Insertable<SecondarySalesEntry> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('customer_id')) {
      context.handle(
          _customerIdMeta,
          customerId.isAcceptableOrUnknown(
              data['customer_id']!, _customerIdMeta));
    } else if (isInserting) {
      context.missing(_customerIdMeta);
    }
    if (data.containsKey('customer_name')) {
      context.handle(
          _customerNameMeta,
          customerName.isAcceptableOrUnknown(
              data['customer_name']!, _customerNameMeta));
    } else if (isInserting) {
      context.missing(_customerNameMeta);
    }
    if (data.containsKey('customer_type')) {
      context.handle(
          _customerTypeMeta,
          customerType.isAcceptableOrUnknown(
              data['customer_type']!, _customerTypeMeta));
    } else if (isInserting) {
      context.missing(_customerTypeMeta);
    }
    if (data.containsKey('entry_type')) {
      context.handle(_entryTypeMeta,
          entryType.isAcceptableOrUnknown(data['entry_type']!, _entryTypeMeta));
    } else if (isInserting) {
      context.missing(_entryTypeMeta);
    }
    if (data.containsKey('entry_date')) {
      context.handle(_entryDateMeta,
          entryDate.isAcceptableOrUnknown(data['entry_date']!, _entryDateMeta));
    } else if (isInserting) {
      context.missing(_entryDateMeta);
    }
    if (data.containsKey('total_sales_value')) {
      context.handle(
          _totalSalesValueMeta,
          totalSalesValue.isAcceptableOrUnknown(
              data['total_sales_value']!, _totalSalesValueMeta));
    }
    if (data.containsKey('total_stock_value')) {
      context.handle(
          _totalStockValueMeta,
          totalStockValue.isAcceptableOrUnknown(
              data['total_stock_value']!, _totalStockValueMeta));
    }
    if (data.containsKey('total_sales_qty')) {
      context.handle(
          _totalSalesQtyMeta,
          totalSalesQty.isAcceptableOrUnknown(
              data['total_sales_qty']!, _totalSalesQtyMeta));
    }
    if (data.containsKey('total_closing_stock')) {
      context.handle(
          _totalClosingStockMeta,
          totalClosingStock.isAcceptableOrUnknown(
              data['total_closing_stock']!, _totalClosingStockMeta));
    }
    if (data.containsKey('status')) {
      context.handle(_statusMeta,
          status.isAcceptableOrUnknown(data['status']!, _statusMeta));
    }
    if (data.containsKey('manager_remarks')) {
      context.handle(
          _managerRemarksMeta,
          managerRemarks.isAcceptableOrUnknown(
              data['manager_remarks']!, _managerRemarksMeta));
    }
    if (data.containsKey('sync_status')) {
      context.handle(
          _syncStatusMeta,
          syncStatus.isAcceptableOrUnknown(
              data['sync_status']!, _syncStatusMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  SecondarySalesEntry map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return SecondarySalesEntry(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      customerId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_id'])!,
      customerName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_name'])!,
      customerType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_type'])!,
      entryType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}entry_type'])!,
      entryDate: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}entry_date'])!,
      totalSalesValue: attachedDatabase.typeMapping.read(
          DriftSqlType.double, data['${effectivePrefix}total_sales_value'])!,
      totalStockValue: attachedDatabase.typeMapping.read(
          DriftSqlType.double, data['${effectivePrefix}total_stock_value'])!,
      totalSalesQty: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}total_sales_qty'])!,
      totalClosingStock: attachedDatabase.typeMapping.read(
          DriftSqlType.int, data['${effectivePrefix}total_closing_stock'])!,
      status: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}status'])!,
      managerRemarks: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}manager_remarks']),
      syncStatus: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sync_status'])!,
    );
  }

  @override
  $SecondarySalesTableTable createAlias(String alias) {
    return $SecondarySalesTableTable(attachedDatabase, alias);
  }
}

class SecondarySalesEntry extends DataClass
    implements Insertable<SecondarySalesEntry> {
  final String id;
  final String customerId;
  final String customerName;
  final String customerType;
  final String entryType;
  final DateTime entryDate;
  final double totalSalesValue;
  final double totalStockValue;
  final int totalSalesQty;
  final int totalClosingStock;
  final String status;
  final String? managerRemarks;
  final int syncStatus;
  const SecondarySalesEntry(
      {required this.id,
      required this.customerId,
      required this.customerName,
      required this.customerType,
      required this.entryType,
      required this.entryDate,
      required this.totalSalesValue,
      required this.totalStockValue,
      required this.totalSalesQty,
      required this.totalClosingStock,
      required this.status,
      this.managerRemarks,
      required this.syncStatus});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['customer_id'] = Variable<String>(customerId);
    map['customer_name'] = Variable<String>(customerName);
    map['customer_type'] = Variable<String>(customerType);
    map['entry_type'] = Variable<String>(entryType);
    map['entry_date'] = Variable<DateTime>(entryDate);
    map['total_sales_value'] = Variable<double>(totalSalesValue);
    map['total_stock_value'] = Variable<double>(totalStockValue);
    map['total_sales_qty'] = Variable<int>(totalSalesQty);
    map['total_closing_stock'] = Variable<int>(totalClosingStock);
    map['status'] = Variable<String>(status);
    if (!nullToAbsent || managerRemarks != null) {
      map['manager_remarks'] = Variable<String>(managerRemarks);
    }
    map['sync_status'] = Variable<int>(syncStatus);
    return map;
  }

  SecondarySalesTableCompanion toCompanion(bool nullToAbsent) {
    return SecondarySalesTableCompanion(
      id: Value(id),
      customerId: Value(customerId),
      customerName: Value(customerName),
      customerType: Value(customerType),
      entryType: Value(entryType),
      entryDate: Value(entryDate),
      totalSalesValue: Value(totalSalesValue),
      totalStockValue: Value(totalStockValue),
      totalSalesQty: Value(totalSalesQty),
      totalClosingStock: Value(totalClosingStock),
      status: Value(status),
      managerRemarks: managerRemarks == null && nullToAbsent
          ? const Value.absent()
          : Value(managerRemarks),
      syncStatus: Value(syncStatus),
    );
  }

  factory SecondarySalesEntry.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return SecondarySalesEntry(
      id: serializer.fromJson<String>(json['id']),
      customerId: serializer.fromJson<String>(json['customerId']),
      customerName: serializer.fromJson<String>(json['customerName']),
      customerType: serializer.fromJson<String>(json['customerType']),
      entryType: serializer.fromJson<String>(json['entryType']),
      entryDate: serializer.fromJson<DateTime>(json['entryDate']),
      totalSalesValue: serializer.fromJson<double>(json['totalSalesValue']),
      totalStockValue: serializer.fromJson<double>(json['totalStockValue']),
      totalSalesQty: serializer.fromJson<int>(json['totalSalesQty']),
      totalClosingStock: serializer.fromJson<int>(json['totalClosingStock']),
      status: serializer.fromJson<String>(json['status']),
      managerRemarks: serializer.fromJson<String?>(json['managerRemarks']),
      syncStatus: serializer.fromJson<int>(json['syncStatus']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'customerId': serializer.toJson<String>(customerId),
      'customerName': serializer.toJson<String>(customerName),
      'customerType': serializer.toJson<String>(customerType),
      'entryType': serializer.toJson<String>(entryType),
      'entryDate': serializer.toJson<DateTime>(entryDate),
      'totalSalesValue': serializer.toJson<double>(totalSalesValue),
      'totalStockValue': serializer.toJson<double>(totalStockValue),
      'totalSalesQty': serializer.toJson<int>(totalSalesQty),
      'totalClosingStock': serializer.toJson<int>(totalClosingStock),
      'status': serializer.toJson<String>(status),
      'managerRemarks': serializer.toJson<String?>(managerRemarks),
      'syncStatus': serializer.toJson<int>(syncStatus),
    };
  }

  SecondarySalesEntry copyWith(
          {String? id,
          String? customerId,
          String? customerName,
          String? customerType,
          String? entryType,
          DateTime? entryDate,
          double? totalSalesValue,
          double? totalStockValue,
          int? totalSalesQty,
          int? totalClosingStock,
          String? status,
          Value<String?> managerRemarks = const Value.absent(),
          int? syncStatus}) =>
      SecondarySalesEntry(
        id: id ?? this.id,
        customerId: customerId ?? this.customerId,
        customerName: customerName ?? this.customerName,
        customerType: customerType ?? this.customerType,
        entryType: entryType ?? this.entryType,
        entryDate: entryDate ?? this.entryDate,
        totalSalesValue: totalSalesValue ?? this.totalSalesValue,
        totalStockValue: totalStockValue ?? this.totalStockValue,
        totalSalesQty: totalSalesQty ?? this.totalSalesQty,
        totalClosingStock: totalClosingStock ?? this.totalClosingStock,
        status: status ?? this.status,
        managerRemarks:
            managerRemarks.present ? managerRemarks.value : this.managerRemarks,
        syncStatus: syncStatus ?? this.syncStatus,
      );
  SecondarySalesEntry copyWithCompanion(SecondarySalesTableCompanion data) {
    return SecondarySalesEntry(
      id: data.id.present ? data.id.value : this.id,
      customerId:
          data.customerId.present ? data.customerId.value : this.customerId,
      customerName: data.customerName.present
          ? data.customerName.value
          : this.customerName,
      customerType: data.customerType.present
          ? data.customerType.value
          : this.customerType,
      entryType: data.entryType.present ? data.entryType.value : this.entryType,
      entryDate: data.entryDate.present ? data.entryDate.value : this.entryDate,
      totalSalesValue: data.totalSalesValue.present
          ? data.totalSalesValue.value
          : this.totalSalesValue,
      totalStockValue: data.totalStockValue.present
          ? data.totalStockValue.value
          : this.totalStockValue,
      totalSalesQty: data.totalSalesQty.present
          ? data.totalSalesQty.value
          : this.totalSalesQty,
      totalClosingStock: data.totalClosingStock.present
          ? data.totalClosingStock.value
          : this.totalClosingStock,
      status: data.status.present ? data.status.value : this.status,
      managerRemarks: data.managerRemarks.present
          ? data.managerRemarks.value
          : this.managerRemarks,
      syncStatus:
          data.syncStatus.present ? data.syncStatus.value : this.syncStatus,
    );
  }

  @override
  String toString() {
    return (StringBuffer('SecondarySalesEntry(')
          ..write('id: $id, ')
          ..write('customerId: $customerId, ')
          ..write('customerName: $customerName, ')
          ..write('customerType: $customerType, ')
          ..write('entryType: $entryType, ')
          ..write('entryDate: $entryDate, ')
          ..write('totalSalesValue: $totalSalesValue, ')
          ..write('totalStockValue: $totalStockValue, ')
          ..write('totalSalesQty: $totalSalesQty, ')
          ..write('totalClosingStock: $totalClosingStock, ')
          ..write('status: $status, ')
          ..write('managerRemarks: $managerRemarks, ')
          ..write('syncStatus: $syncStatus')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      customerId,
      customerName,
      customerType,
      entryType,
      entryDate,
      totalSalesValue,
      totalStockValue,
      totalSalesQty,
      totalClosingStock,
      status,
      managerRemarks,
      syncStatus);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is SecondarySalesEntry &&
          other.id == this.id &&
          other.customerId == this.customerId &&
          other.customerName == this.customerName &&
          other.customerType == this.customerType &&
          other.entryType == this.entryType &&
          other.entryDate == this.entryDate &&
          other.totalSalesValue == this.totalSalesValue &&
          other.totalStockValue == this.totalStockValue &&
          other.totalSalesQty == this.totalSalesQty &&
          other.totalClosingStock == this.totalClosingStock &&
          other.status == this.status &&
          other.managerRemarks == this.managerRemarks &&
          other.syncStatus == this.syncStatus);
}

class SecondarySalesTableCompanion
    extends UpdateCompanion<SecondarySalesEntry> {
  final Value<String> id;
  final Value<String> customerId;
  final Value<String> customerName;
  final Value<String> customerType;
  final Value<String> entryType;
  final Value<DateTime> entryDate;
  final Value<double> totalSalesValue;
  final Value<double> totalStockValue;
  final Value<int> totalSalesQty;
  final Value<int> totalClosingStock;
  final Value<String> status;
  final Value<String?> managerRemarks;
  final Value<int> syncStatus;
  final Value<int> rowid;
  const SecondarySalesTableCompanion({
    this.id = const Value.absent(),
    this.customerId = const Value.absent(),
    this.customerName = const Value.absent(),
    this.customerType = const Value.absent(),
    this.entryType = const Value.absent(),
    this.entryDate = const Value.absent(),
    this.totalSalesValue = const Value.absent(),
    this.totalStockValue = const Value.absent(),
    this.totalSalesQty = const Value.absent(),
    this.totalClosingStock = const Value.absent(),
    this.status = const Value.absent(),
    this.managerRemarks = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  SecondarySalesTableCompanion.insert({
    required String id,
    required String customerId,
    required String customerName,
    required String customerType,
    required String entryType,
    required DateTime entryDate,
    this.totalSalesValue = const Value.absent(),
    this.totalStockValue = const Value.absent(),
    this.totalSalesQty = const Value.absent(),
    this.totalClosingStock = const Value.absent(),
    this.status = const Value.absent(),
    this.managerRemarks = const Value.absent(),
    this.syncStatus = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        customerId = Value(customerId),
        customerName = Value(customerName),
        customerType = Value(customerType),
        entryType = Value(entryType),
        entryDate = Value(entryDate);
  static Insertable<SecondarySalesEntry> custom({
    Expression<String>? id,
    Expression<String>? customerId,
    Expression<String>? customerName,
    Expression<String>? customerType,
    Expression<String>? entryType,
    Expression<DateTime>? entryDate,
    Expression<double>? totalSalesValue,
    Expression<double>? totalStockValue,
    Expression<int>? totalSalesQty,
    Expression<int>? totalClosingStock,
    Expression<String>? status,
    Expression<String>? managerRemarks,
    Expression<int>? syncStatus,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (customerId != null) 'customer_id': customerId,
      if (customerName != null) 'customer_name': customerName,
      if (customerType != null) 'customer_type': customerType,
      if (entryType != null) 'entry_type': entryType,
      if (entryDate != null) 'entry_date': entryDate,
      if (totalSalesValue != null) 'total_sales_value': totalSalesValue,
      if (totalStockValue != null) 'total_stock_value': totalStockValue,
      if (totalSalesQty != null) 'total_sales_qty': totalSalesQty,
      if (totalClosingStock != null) 'total_closing_stock': totalClosingStock,
      if (status != null) 'status': status,
      if (managerRemarks != null) 'manager_remarks': managerRemarks,
      if (syncStatus != null) 'sync_status': syncStatus,
      if (rowid != null) 'rowid': rowid,
    });
  }

  SecondarySalesTableCompanion copyWith(
      {Value<String>? id,
      Value<String>? customerId,
      Value<String>? customerName,
      Value<String>? customerType,
      Value<String>? entryType,
      Value<DateTime>? entryDate,
      Value<double>? totalSalesValue,
      Value<double>? totalStockValue,
      Value<int>? totalSalesQty,
      Value<int>? totalClosingStock,
      Value<String>? status,
      Value<String?>? managerRemarks,
      Value<int>? syncStatus,
      Value<int>? rowid}) {
    return SecondarySalesTableCompanion(
      id: id ?? this.id,
      customerId: customerId ?? this.customerId,
      customerName: customerName ?? this.customerName,
      customerType: customerType ?? this.customerType,
      entryType: entryType ?? this.entryType,
      entryDate: entryDate ?? this.entryDate,
      totalSalesValue: totalSalesValue ?? this.totalSalesValue,
      totalStockValue: totalStockValue ?? this.totalStockValue,
      totalSalesQty: totalSalesQty ?? this.totalSalesQty,
      totalClosingStock: totalClosingStock ?? this.totalClosingStock,
      status: status ?? this.status,
      managerRemarks: managerRemarks ?? this.managerRemarks,
      syncStatus: syncStatus ?? this.syncStatus,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (customerId.present) {
      map['customer_id'] = Variable<String>(customerId.value);
    }
    if (customerName.present) {
      map['customer_name'] = Variable<String>(customerName.value);
    }
    if (customerType.present) {
      map['customer_type'] = Variable<String>(customerType.value);
    }
    if (entryType.present) {
      map['entry_type'] = Variable<String>(entryType.value);
    }
    if (entryDate.present) {
      map['entry_date'] = Variable<DateTime>(entryDate.value);
    }
    if (totalSalesValue.present) {
      map['total_sales_value'] = Variable<double>(totalSalesValue.value);
    }
    if (totalStockValue.present) {
      map['total_stock_value'] = Variable<double>(totalStockValue.value);
    }
    if (totalSalesQty.present) {
      map['total_sales_qty'] = Variable<int>(totalSalesQty.value);
    }
    if (totalClosingStock.present) {
      map['total_closing_stock'] = Variable<int>(totalClosingStock.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (managerRemarks.present) {
      map['manager_remarks'] = Variable<String>(managerRemarks.value);
    }
    if (syncStatus.present) {
      map['sync_status'] = Variable<int>(syncStatus.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('SecondarySalesTableCompanion(')
          ..write('id: $id, ')
          ..write('customerId: $customerId, ')
          ..write('customerName: $customerName, ')
          ..write('customerType: $customerType, ')
          ..write('entryType: $entryType, ')
          ..write('entryDate: $entryDate, ')
          ..write('totalSalesValue: $totalSalesValue, ')
          ..write('totalStockValue: $totalStockValue, ')
          ..write('totalSalesQty: $totalSalesQty, ')
          ..write('totalClosingStock: $totalClosingStock, ')
          ..write('status: $status, ')
          ..write('managerRemarks: $managerRemarks, ')
          ..write('syncStatus: $syncStatus, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $SyncQueueTableTable syncQueueTable = $SyncQueueTableTable(this);
  late final $AttendanceTableTable attendanceTable =
      $AttendanceTableTable(this);
  late final $CustomerTableTable customerTable = $CustomerTableTable(this);
  late final $DcrCheckInTableTable dcrCheckInTable =
      $DcrCheckInTableTable(this);
  late final $DcrCheckOutTableTable dcrCheckOutTable =
      $DcrCheckOutTableTable(this);
  late final $DcrReportTableTable dcrReportTable = $DcrReportTableTable(this);
  late final $DcrSubmissionTableTable dcrSubmissionTable =
      $DcrSubmissionTableTable(this);
  late final $DeviationTableTable deviationTable = $DeviationTableTable(this);
  late final $ExpenseApprovalTableTable expenseApprovalTable =
      $ExpenseApprovalTableTable(this);
  late final $ExpenseAuditTableTable expenseAuditTable =
      $ExpenseAuditTableTable(this);
  late final $ExpenseBillTableTable expenseBillTable =
      $ExpenseBillTableTable(this);
  late final $ExpensePaymentTableTable expensePaymentTable =
      $ExpensePaymentTableTable(this);
  late final $ExpenseTableTable expenseTable = $ExpenseTableTable(this);
  late final $GpsLogTableTable gpsLogTable = $GpsLogTableTable(this);
  late final $HolidayTableTable holidayTable = $HolidayTableTable(this);
  late final $JointWorkTableTable jointWorkTable = $JointWorkTableTable(this);
  late final $MiscExpenseTableTable miscExpenseTable =
      $MiscExpenseTableTable(this);
  late final $MtpAuditTableTable mtpAuditTable = $MtpAuditTableTable(this);
  late final $MtpSettingsTableTable mtpSettingsTable =
      $MtpSettingsTableTable(this);
  late final $MtpTableTable mtpTable = $MtpTableTable(this);
  late final $MtpDayTableTable mtpDayTable = $MtpDayTableTable(this);
  late final $MtpDoctorTableTable mtpDoctorTable = $MtpDoctorTableTable(this);
  late final $OverrideRequestTableTable overrideRequestTable =
      $OverrideRequestTableTable(this);
  late final $ProductTableTable productTable = $ProductTableTable(this);
  late final $SecondarySalesProductTableTable secondarySalesProductTable =
      $SecondarySalesProductTableTable(this);
  late final $SecondarySalesTableTable secondarySalesTable =
      $SecondarySalesTableTable(this);
  late final AttendanceDao attendanceDao = AttendanceDao(this as AppDatabase);
  late final SyncQueueDao syncQueueDao = SyncQueueDao(this as AppDatabase);
  late final CustomerDao customerDao = CustomerDao(this as AppDatabase);
  late final DcrDao dcrDao = DcrDao(this as AppDatabase);
  late final ExpenseDao expenseDao = ExpenseDao(this as AppDatabase);
  late final MtpDao mtpDao = MtpDao(this as AppDatabase);
  late final SecondarySalesDao secondarySalesDao =
      SecondarySalesDao(this as AppDatabase);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
        syncQueueTable,
        attendanceTable,
        customerTable,
        dcrCheckInTable,
        dcrCheckOutTable,
        dcrReportTable,
        dcrSubmissionTable,
        deviationTable,
        expenseApprovalTable,
        expenseAuditTable,
        expenseBillTable,
        expensePaymentTable,
        expenseTable,
        gpsLogTable,
        holidayTable,
        jointWorkTable,
        miscExpenseTable,
        mtpAuditTable,
        mtpSettingsTable,
        mtpTable,
        mtpDayTable,
        mtpDoctorTable,
        overrideRequestTable,
        productTable,
        secondarySalesProductTable,
        secondarySalesTable
      ];
}

typedef $$SyncQueueTableTableCreateCompanionBuilder = SyncQueueTableCompanion
    Function({
  Value<int> id,
  required String entityType,
  required String entityId,
  required String operation,
  required String payload,
  Value<int> status,
  Value<int> retryCount,
  Value<String?> errorMessage,
  Value<DateTime> createdAt,
});
typedef $$SyncQueueTableTableUpdateCompanionBuilder = SyncQueueTableCompanion
    Function({
  Value<int> id,
  Value<String> entityType,
  Value<String> entityId,
  Value<String> operation,
  Value<String> payload,
  Value<int> status,
  Value<int> retryCount,
  Value<String?> errorMessage,
  Value<DateTime> createdAt,
});

class $$SyncQueueTableTableFilterComposer
    extends Composer<_$AppDatabase, $SyncQueueTableTable> {
  $$SyncQueueTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get entityType => $composableBuilder(
      column: $table.entityType, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get entityId => $composableBuilder(
      column: $table.entityId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get operation => $composableBuilder(
      column: $table.operation, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get payload => $composableBuilder(
      column: $table.payload, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get retryCount => $composableBuilder(
      column: $table.retryCount, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get errorMessage => $composableBuilder(
      column: $table.errorMessage, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));
}

class $$SyncQueueTableTableOrderingComposer
    extends Composer<_$AppDatabase, $SyncQueueTableTable> {
  $$SyncQueueTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get entityType => $composableBuilder(
      column: $table.entityType, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get entityId => $composableBuilder(
      column: $table.entityId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get operation => $composableBuilder(
      column: $table.operation, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get payload => $composableBuilder(
      column: $table.payload, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get retryCount => $composableBuilder(
      column: $table.retryCount, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get errorMessage => $composableBuilder(
      column: $table.errorMessage,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));
}

class $$SyncQueueTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $SyncQueueTableTable> {
  $$SyncQueueTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get entityType => $composableBuilder(
      column: $table.entityType, builder: (column) => column);

  GeneratedColumn<String> get entityId =>
      $composableBuilder(column: $table.entityId, builder: (column) => column);

  GeneratedColumn<String> get operation =>
      $composableBuilder(column: $table.operation, builder: (column) => column);

  GeneratedColumn<String> get payload =>
      $composableBuilder(column: $table.payload, builder: (column) => column);

  GeneratedColumn<int> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<int> get retryCount => $composableBuilder(
      column: $table.retryCount, builder: (column) => column);

  GeneratedColumn<String> get errorMessage => $composableBuilder(
      column: $table.errorMessage, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);
}

class $$SyncQueueTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $SyncQueueTableTable,
    SyncQueueEntry,
    $$SyncQueueTableTableFilterComposer,
    $$SyncQueueTableTableOrderingComposer,
    $$SyncQueueTableTableAnnotationComposer,
    $$SyncQueueTableTableCreateCompanionBuilder,
    $$SyncQueueTableTableUpdateCompanionBuilder,
    (
      SyncQueueEntry,
      BaseReferences<_$AppDatabase, $SyncQueueTableTable, SyncQueueEntry>
    ),
    SyncQueueEntry,
    PrefetchHooks Function()> {
  $$SyncQueueTableTableTableManager(
      _$AppDatabase db, $SyncQueueTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$SyncQueueTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$SyncQueueTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$SyncQueueTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> entityType = const Value.absent(),
            Value<String> entityId = const Value.absent(),
            Value<String> operation = const Value.absent(),
            Value<String> payload = const Value.absent(),
            Value<int> status = const Value.absent(),
            Value<int> retryCount = const Value.absent(),
            Value<String?> errorMessage = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              SyncQueueTableCompanion(
            id: id,
            entityType: entityType,
            entityId: entityId,
            operation: operation,
            payload: payload,
            status: status,
            retryCount: retryCount,
            errorMessage: errorMessage,
            createdAt: createdAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String entityType,
            required String entityId,
            required String operation,
            required String payload,
            Value<int> status = const Value.absent(),
            Value<int> retryCount = const Value.absent(),
            Value<String?> errorMessage = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              SyncQueueTableCompanion.insert(
            id: id,
            entityType: entityType,
            entityId: entityId,
            operation: operation,
            payload: payload,
            status: status,
            retryCount: retryCount,
            errorMessage: errorMessage,
            createdAt: createdAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$SyncQueueTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $SyncQueueTableTable,
    SyncQueueEntry,
    $$SyncQueueTableTableFilterComposer,
    $$SyncQueueTableTableOrderingComposer,
    $$SyncQueueTableTableAnnotationComposer,
    $$SyncQueueTableTableCreateCompanionBuilder,
    $$SyncQueueTableTableUpdateCompanionBuilder,
    (
      SyncQueueEntry,
      BaseReferences<_$AppDatabase, $SyncQueueTableTable, SyncQueueEntry>
    ),
    SyncQueueEntry,
    PrefetchHooks Function()>;
typedef $$AttendanceTableTableCreateCompanionBuilder = AttendanceTableCompanion
    Function({
  Value<int> id,
  required String employeeId,
  required DateTime date,
  required DateTime punchInTime,
  required double latitude,
  required double longitude,
  required double accuracy,
  required String deviceId,
  required int batteryPercentage,
  required String networkType,
  Value<int> syncStatus,
  Value<DateTime> createdAt,
});
typedef $$AttendanceTableTableUpdateCompanionBuilder = AttendanceTableCompanion
    Function({
  Value<int> id,
  Value<String> employeeId,
  Value<DateTime> date,
  Value<DateTime> punchInTime,
  Value<double> latitude,
  Value<double> longitude,
  Value<double> accuracy,
  Value<String> deviceId,
  Value<int> batteryPercentage,
  Value<String> networkType,
  Value<int> syncStatus,
  Value<DateTime> createdAt,
});

class $$AttendanceTableTableFilterComposer
    extends Composer<_$AppDatabase, $AttendanceTableTable> {
  $$AttendanceTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get punchInTime => $composableBuilder(
      column: $table.punchInTime, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get accuracy => $composableBuilder(
      column: $table.accuracy, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get deviceId => $composableBuilder(
      column: $table.deviceId, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get batteryPercentage => $composableBuilder(
      column: $table.batteryPercentage,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get networkType => $composableBuilder(
      column: $table.networkType, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));
}

class $$AttendanceTableTableOrderingComposer
    extends Composer<_$AppDatabase, $AttendanceTableTable> {
  $$AttendanceTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get punchInTime => $composableBuilder(
      column: $table.punchInTime, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get accuracy => $composableBuilder(
      column: $table.accuracy, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get deviceId => $composableBuilder(
      column: $table.deviceId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get batteryPercentage => $composableBuilder(
      column: $table.batteryPercentage,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get networkType => $composableBuilder(
      column: $table.networkType, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));
}

class $$AttendanceTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $AttendanceTableTable> {
  $$AttendanceTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => column);

  GeneratedColumn<DateTime> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<DateTime> get punchInTime => $composableBuilder(
      column: $table.punchInTime, builder: (column) => column);

  GeneratedColumn<double> get latitude =>
      $composableBuilder(column: $table.latitude, builder: (column) => column);

  GeneratedColumn<double> get longitude =>
      $composableBuilder(column: $table.longitude, builder: (column) => column);

  GeneratedColumn<double> get accuracy =>
      $composableBuilder(column: $table.accuracy, builder: (column) => column);

  GeneratedColumn<String> get deviceId =>
      $composableBuilder(column: $table.deviceId, builder: (column) => column);

  GeneratedColumn<int> get batteryPercentage => $composableBuilder(
      column: $table.batteryPercentage, builder: (column) => column);

  GeneratedColumn<String> get networkType => $composableBuilder(
      column: $table.networkType, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);
}

class $$AttendanceTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $AttendanceTableTable,
    AttendanceEntry,
    $$AttendanceTableTableFilterComposer,
    $$AttendanceTableTableOrderingComposer,
    $$AttendanceTableTableAnnotationComposer,
    $$AttendanceTableTableCreateCompanionBuilder,
    $$AttendanceTableTableUpdateCompanionBuilder,
    (
      AttendanceEntry,
      BaseReferences<_$AppDatabase, $AttendanceTableTable, AttendanceEntry>
    ),
    AttendanceEntry,
    PrefetchHooks Function()> {
  $$AttendanceTableTableTableManager(
      _$AppDatabase db, $AttendanceTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$AttendanceTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$AttendanceTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$AttendanceTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> employeeId = const Value.absent(),
            Value<DateTime> date = const Value.absent(),
            Value<DateTime> punchInTime = const Value.absent(),
            Value<double> latitude = const Value.absent(),
            Value<double> longitude = const Value.absent(),
            Value<double> accuracy = const Value.absent(),
            Value<String> deviceId = const Value.absent(),
            Value<int> batteryPercentage = const Value.absent(),
            Value<String> networkType = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              AttendanceTableCompanion(
            id: id,
            employeeId: employeeId,
            date: date,
            punchInTime: punchInTime,
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy,
            deviceId: deviceId,
            batteryPercentage: batteryPercentage,
            networkType: networkType,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String employeeId,
            required DateTime date,
            required DateTime punchInTime,
            required double latitude,
            required double longitude,
            required double accuracy,
            required String deviceId,
            required int batteryPercentage,
            required String networkType,
            Value<int> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              AttendanceTableCompanion.insert(
            id: id,
            employeeId: employeeId,
            date: date,
            punchInTime: punchInTime,
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy,
            deviceId: deviceId,
            batteryPercentage: batteryPercentage,
            networkType: networkType,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$AttendanceTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $AttendanceTableTable,
    AttendanceEntry,
    $$AttendanceTableTableFilterComposer,
    $$AttendanceTableTableOrderingComposer,
    $$AttendanceTableTableAnnotationComposer,
    $$AttendanceTableTableCreateCompanionBuilder,
    $$AttendanceTableTableUpdateCompanionBuilder,
    (
      AttendanceEntry,
      BaseReferences<_$AppDatabase, $AttendanceTableTable, AttendanceEntry>
    ),
    AttendanceEntry,
    PrefetchHooks Function()>;
typedef $$CustomerTableTableCreateCompanionBuilder = CustomerTableCompanion
    Function({
  required String id,
  required String name,
  required String type,
  Value<String?> specialty,
  Value<String?> qualification,
  Value<String?> mobile,
  Value<String?> address,
  Value<double?> latitude,
  Value<double?> longitude,
  Value<String?> area,
  Value<String?> city,
  Value<String?> state,
  Value<String?> pincode,
  Value<String?> classification,
  Value<String> status,
  Value<int> syncStatus,
  Value<int> rowid,
});
typedef $$CustomerTableTableUpdateCompanionBuilder = CustomerTableCompanion
    Function({
  Value<String> id,
  Value<String> name,
  Value<String> type,
  Value<String?> specialty,
  Value<String?> qualification,
  Value<String?> mobile,
  Value<String?> address,
  Value<double?> latitude,
  Value<double?> longitude,
  Value<String?> area,
  Value<String?> city,
  Value<String?> state,
  Value<String?> pincode,
  Value<String?> classification,
  Value<String> status,
  Value<int> syncStatus,
  Value<int> rowid,
});

class $$CustomerTableTableFilterComposer
    extends Composer<_$AppDatabase, $CustomerTableTable> {
  $$CustomerTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get type => $composableBuilder(
      column: $table.type, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get specialty => $composableBuilder(
      column: $table.specialty, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get qualification => $composableBuilder(
      column: $table.qualification, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get mobile => $composableBuilder(
      column: $table.mobile, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get address => $composableBuilder(
      column: $table.address, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get area => $composableBuilder(
      column: $table.area, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get city => $composableBuilder(
      column: $table.city, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get state => $composableBuilder(
      column: $table.state, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get pincode => $composableBuilder(
      column: $table.pincode, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get classification => $composableBuilder(
      column: $table.classification,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$CustomerTableTableOrderingComposer
    extends Composer<_$AppDatabase, $CustomerTableTable> {
  $$CustomerTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get type => $composableBuilder(
      column: $table.type, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get specialty => $composableBuilder(
      column: $table.specialty, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get qualification => $composableBuilder(
      column: $table.qualification,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get mobile => $composableBuilder(
      column: $table.mobile, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get address => $composableBuilder(
      column: $table.address, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get area => $composableBuilder(
      column: $table.area, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get city => $composableBuilder(
      column: $table.city, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get state => $composableBuilder(
      column: $table.state, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get pincode => $composableBuilder(
      column: $table.pincode, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get classification => $composableBuilder(
      column: $table.classification,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$CustomerTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $CustomerTableTable> {
  $$CustomerTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get type =>
      $composableBuilder(column: $table.type, builder: (column) => column);

  GeneratedColumn<String> get specialty =>
      $composableBuilder(column: $table.specialty, builder: (column) => column);

  GeneratedColumn<String> get qualification => $composableBuilder(
      column: $table.qualification, builder: (column) => column);

  GeneratedColumn<String> get mobile =>
      $composableBuilder(column: $table.mobile, builder: (column) => column);

  GeneratedColumn<String> get address =>
      $composableBuilder(column: $table.address, builder: (column) => column);

  GeneratedColumn<double> get latitude =>
      $composableBuilder(column: $table.latitude, builder: (column) => column);

  GeneratedColumn<double> get longitude =>
      $composableBuilder(column: $table.longitude, builder: (column) => column);

  GeneratedColumn<String> get area =>
      $composableBuilder(column: $table.area, builder: (column) => column);

  GeneratedColumn<String> get city =>
      $composableBuilder(column: $table.city, builder: (column) => column);

  GeneratedColumn<String> get state =>
      $composableBuilder(column: $table.state, builder: (column) => column);

  GeneratedColumn<String> get pincode =>
      $composableBuilder(column: $table.pincode, builder: (column) => column);

  GeneratedColumn<String> get classification => $composableBuilder(
      column: $table.classification, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$CustomerTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CustomerTableTable,
    CustomerEntry,
    $$CustomerTableTableFilterComposer,
    $$CustomerTableTableOrderingComposer,
    $$CustomerTableTableAnnotationComposer,
    $$CustomerTableTableCreateCompanionBuilder,
    $$CustomerTableTableUpdateCompanionBuilder,
    (
      CustomerEntry,
      BaseReferences<_$AppDatabase, $CustomerTableTable, CustomerEntry>
    ),
    CustomerEntry,
    PrefetchHooks Function()> {
  $$CustomerTableTableTableManager(_$AppDatabase db, $CustomerTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$CustomerTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$CustomerTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$CustomerTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> name = const Value.absent(),
            Value<String> type = const Value.absent(),
            Value<String?> specialty = const Value.absent(),
            Value<String?> qualification = const Value.absent(),
            Value<String?> mobile = const Value.absent(),
            Value<String?> address = const Value.absent(),
            Value<double?> latitude = const Value.absent(),
            Value<double?> longitude = const Value.absent(),
            Value<String?> area = const Value.absent(),
            Value<String?> city = const Value.absent(),
            Value<String?> state = const Value.absent(),
            Value<String?> pincode = const Value.absent(),
            Value<String?> classification = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CustomerTableCompanion(
            id: id,
            name: name,
            type: type,
            specialty: specialty,
            qualification: qualification,
            mobile: mobile,
            address: address,
            latitude: latitude,
            longitude: longitude,
            area: area,
            city: city,
            state: state,
            pincode: pincode,
            classification: classification,
            status: status,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String name,
            required String type,
            Value<String?> specialty = const Value.absent(),
            Value<String?> qualification = const Value.absent(),
            Value<String?> mobile = const Value.absent(),
            Value<String?> address = const Value.absent(),
            Value<double?> latitude = const Value.absent(),
            Value<double?> longitude = const Value.absent(),
            Value<String?> area = const Value.absent(),
            Value<String?> city = const Value.absent(),
            Value<String?> state = const Value.absent(),
            Value<String?> pincode = const Value.absent(),
            Value<String?> classification = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CustomerTableCompanion.insert(
            id: id,
            name: name,
            type: type,
            specialty: specialty,
            qualification: qualification,
            mobile: mobile,
            address: address,
            latitude: latitude,
            longitude: longitude,
            area: area,
            city: city,
            state: state,
            pincode: pincode,
            classification: classification,
            status: status,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$CustomerTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $CustomerTableTable,
    CustomerEntry,
    $$CustomerTableTableFilterComposer,
    $$CustomerTableTableOrderingComposer,
    $$CustomerTableTableAnnotationComposer,
    $$CustomerTableTableCreateCompanionBuilder,
    $$CustomerTableTableUpdateCompanionBuilder,
    (
      CustomerEntry,
      BaseReferences<_$AppDatabase, $CustomerTableTable, CustomerEntry>
    ),
    CustomerEntry,
    PrefetchHooks Function()>;
typedef $$DcrCheckInTableTableCreateCompanionBuilder = DcrCheckInTableCompanion
    Function({
  Value<int> id,
  required String employeeId,
  required String customerId,
  required DateTime date,
  required DateTime checkInTime,
  required double latitude,
  required double longitude,
  required double accuracy,
  required double distance,
  Value<String?> deviceId,
  Value<bool> isInternetAvailable,
  Value<int?> batteryPercentage,
  Value<int> syncStatus,
  Value<String?> callId,
});
typedef $$DcrCheckInTableTableUpdateCompanionBuilder = DcrCheckInTableCompanion
    Function({
  Value<int> id,
  Value<String> employeeId,
  Value<String> customerId,
  Value<DateTime> date,
  Value<DateTime> checkInTime,
  Value<double> latitude,
  Value<double> longitude,
  Value<double> accuracy,
  Value<double> distance,
  Value<String?> deviceId,
  Value<bool> isInternetAvailable,
  Value<int?> batteryPercentage,
  Value<int> syncStatus,
  Value<String?> callId,
});

class $$DcrCheckInTableTableFilterComposer
    extends Composer<_$AppDatabase, $DcrCheckInTableTable> {
  $$DcrCheckInTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get checkInTime => $composableBuilder(
      column: $table.checkInTime, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get accuracy => $composableBuilder(
      column: $table.accuracy, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get distance => $composableBuilder(
      column: $table.distance, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get deviceId => $composableBuilder(
      column: $table.deviceId, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isInternetAvailable => $composableBuilder(
      column: $table.isInternetAvailable,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get batteryPercentage => $composableBuilder(
      column: $table.batteryPercentage,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get callId => $composableBuilder(
      column: $table.callId, builder: (column) => ColumnFilters(column));
}

class $$DcrCheckInTableTableOrderingComposer
    extends Composer<_$AppDatabase, $DcrCheckInTableTable> {
  $$DcrCheckInTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get checkInTime => $composableBuilder(
      column: $table.checkInTime, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get accuracy => $composableBuilder(
      column: $table.accuracy, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get distance => $composableBuilder(
      column: $table.distance, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get deviceId => $composableBuilder(
      column: $table.deviceId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isInternetAvailable => $composableBuilder(
      column: $table.isInternetAvailable,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get batteryPercentage => $composableBuilder(
      column: $table.batteryPercentage,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get callId => $composableBuilder(
      column: $table.callId, builder: (column) => ColumnOrderings(column));
}

class $$DcrCheckInTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $DcrCheckInTableTable> {
  $$DcrCheckInTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => column);

  GeneratedColumn<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => column);

  GeneratedColumn<DateTime> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<DateTime> get checkInTime => $composableBuilder(
      column: $table.checkInTime, builder: (column) => column);

  GeneratedColumn<double> get latitude =>
      $composableBuilder(column: $table.latitude, builder: (column) => column);

  GeneratedColumn<double> get longitude =>
      $composableBuilder(column: $table.longitude, builder: (column) => column);

  GeneratedColumn<double> get accuracy =>
      $composableBuilder(column: $table.accuracy, builder: (column) => column);

  GeneratedColumn<double> get distance =>
      $composableBuilder(column: $table.distance, builder: (column) => column);

  GeneratedColumn<String> get deviceId =>
      $composableBuilder(column: $table.deviceId, builder: (column) => column);

  GeneratedColumn<bool> get isInternetAvailable => $composableBuilder(
      column: $table.isInternetAvailable, builder: (column) => column);

  GeneratedColumn<int> get batteryPercentage => $composableBuilder(
      column: $table.batteryPercentage, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);

  GeneratedColumn<String> get callId =>
      $composableBuilder(column: $table.callId, builder: (column) => column);
}

class $$DcrCheckInTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $DcrCheckInTableTable,
    DcrCheckInEntry,
    $$DcrCheckInTableTableFilterComposer,
    $$DcrCheckInTableTableOrderingComposer,
    $$DcrCheckInTableTableAnnotationComposer,
    $$DcrCheckInTableTableCreateCompanionBuilder,
    $$DcrCheckInTableTableUpdateCompanionBuilder,
    (
      DcrCheckInEntry,
      BaseReferences<_$AppDatabase, $DcrCheckInTableTable, DcrCheckInEntry>
    ),
    DcrCheckInEntry,
    PrefetchHooks Function()> {
  $$DcrCheckInTableTableTableManager(
      _$AppDatabase db, $DcrCheckInTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DcrCheckInTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DcrCheckInTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DcrCheckInTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> employeeId = const Value.absent(),
            Value<String> customerId = const Value.absent(),
            Value<DateTime> date = const Value.absent(),
            Value<DateTime> checkInTime = const Value.absent(),
            Value<double> latitude = const Value.absent(),
            Value<double> longitude = const Value.absent(),
            Value<double> accuracy = const Value.absent(),
            Value<double> distance = const Value.absent(),
            Value<String?> deviceId = const Value.absent(),
            Value<bool> isInternetAvailable = const Value.absent(),
            Value<int?> batteryPercentage = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<String?> callId = const Value.absent(),
          }) =>
              DcrCheckInTableCompanion(
            id: id,
            employeeId: employeeId,
            customerId: customerId,
            date: date,
            checkInTime: checkInTime,
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy,
            distance: distance,
            deviceId: deviceId,
            isInternetAvailable: isInternetAvailable,
            batteryPercentage: batteryPercentage,
            syncStatus: syncStatus,
            callId: callId,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String employeeId,
            required String customerId,
            required DateTime date,
            required DateTime checkInTime,
            required double latitude,
            required double longitude,
            required double accuracy,
            required double distance,
            Value<String?> deviceId = const Value.absent(),
            Value<bool> isInternetAvailable = const Value.absent(),
            Value<int?> batteryPercentage = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<String?> callId = const Value.absent(),
          }) =>
              DcrCheckInTableCompanion.insert(
            id: id,
            employeeId: employeeId,
            customerId: customerId,
            date: date,
            checkInTime: checkInTime,
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy,
            distance: distance,
            deviceId: deviceId,
            isInternetAvailable: isInternetAvailable,
            batteryPercentage: batteryPercentage,
            syncStatus: syncStatus,
            callId: callId,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$DcrCheckInTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $DcrCheckInTableTable,
    DcrCheckInEntry,
    $$DcrCheckInTableTableFilterComposer,
    $$DcrCheckInTableTableOrderingComposer,
    $$DcrCheckInTableTableAnnotationComposer,
    $$DcrCheckInTableTableCreateCompanionBuilder,
    $$DcrCheckInTableTableUpdateCompanionBuilder,
    (
      DcrCheckInEntry,
      BaseReferences<_$AppDatabase, $DcrCheckInTableTable, DcrCheckInEntry>
    ),
    DcrCheckInEntry,
    PrefetchHooks Function()>;
typedef $$DcrCheckOutTableTableCreateCompanionBuilder
    = DcrCheckOutTableCompanion Function({
  required String checkInId,
  required String customerId,
  required DateTime checkInTime,
  required DateTime checkOutTime,
  required int visitDurationMinutes,
  required double latitude,
  required double longitude,
  required double accuracy,
  required double distance,
  required String callStatus,
  Value<String?> doctorMood,
  Value<String?> productInterest,
  Value<String?> competitorActivity,
  Value<String?> newOpportunity,
  Value<String?> complaint,
  Value<bool> followUpRequired,
  Value<String?> nextVisitNotes,
  Value<String?> remarks,
  Value<bool> isInternetAvailable,
  Value<int> syncStatus,
  Value<int> rowid,
});
typedef $$DcrCheckOutTableTableUpdateCompanionBuilder
    = DcrCheckOutTableCompanion Function({
  Value<String> checkInId,
  Value<String> customerId,
  Value<DateTime> checkInTime,
  Value<DateTime> checkOutTime,
  Value<int> visitDurationMinutes,
  Value<double> latitude,
  Value<double> longitude,
  Value<double> accuracy,
  Value<double> distance,
  Value<String> callStatus,
  Value<String?> doctorMood,
  Value<String?> productInterest,
  Value<String?> competitorActivity,
  Value<String?> newOpportunity,
  Value<String?> complaint,
  Value<bool> followUpRequired,
  Value<String?> nextVisitNotes,
  Value<String?> remarks,
  Value<bool> isInternetAvailable,
  Value<int> syncStatus,
  Value<int> rowid,
});

class $$DcrCheckOutTableTableFilterComposer
    extends Composer<_$AppDatabase, $DcrCheckOutTableTable> {
  $$DcrCheckOutTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get checkInId => $composableBuilder(
      column: $table.checkInId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get checkInTime => $composableBuilder(
      column: $table.checkInTime, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get checkOutTime => $composableBuilder(
      column: $table.checkOutTime, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get visitDurationMinutes => $composableBuilder(
      column: $table.visitDurationMinutes,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get accuracy => $composableBuilder(
      column: $table.accuracy, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get distance => $composableBuilder(
      column: $table.distance, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get callStatus => $composableBuilder(
      column: $table.callStatus, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get doctorMood => $composableBuilder(
      column: $table.doctorMood, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get productInterest => $composableBuilder(
      column: $table.productInterest,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get competitorActivity => $composableBuilder(
      column: $table.competitorActivity,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get newOpportunity => $composableBuilder(
      column: $table.newOpportunity,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get complaint => $composableBuilder(
      column: $table.complaint, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get followUpRequired => $composableBuilder(
      column: $table.followUpRequired,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get nextVisitNotes => $composableBuilder(
      column: $table.nextVisitNotes,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get remarks => $composableBuilder(
      column: $table.remarks, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isInternetAvailable => $composableBuilder(
      column: $table.isInternetAvailable,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$DcrCheckOutTableTableOrderingComposer
    extends Composer<_$AppDatabase, $DcrCheckOutTableTable> {
  $$DcrCheckOutTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get checkInId => $composableBuilder(
      column: $table.checkInId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get checkInTime => $composableBuilder(
      column: $table.checkInTime, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get checkOutTime => $composableBuilder(
      column: $table.checkOutTime,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get visitDurationMinutes => $composableBuilder(
      column: $table.visitDurationMinutes,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get accuracy => $composableBuilder(
      column: $table.accuracy, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get distance => $composableBuilder(
      column: $table.distance, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get callStatus => $composableBuilder(
      column: $table.callStatus, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get doctorMood => $composableBuilder(
      column: $table.doctorMood, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get productInterest => $composableBuilder(
      column: $table.productInterest,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get competitorActivity => $composableBuilder(
      column: $table.competitorActivity,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get newOpportunity => $composableBuilder(
      column: $table.newOpportunity,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get complaint => $composableBuilder(
      column: $table.complaint, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get followUpRequired => $composableBuilder(
      column: $table.followUpRequired,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get nextVisitNotes => $composableBuilder(
      column: $table.nextVisitNotes,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get remarks => $composableBuilder(
      column: $table.remarks, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isInternetAvailable => $composableBuilder(
      column: $table.isInternetAvailable,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$DcrCheckOutTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $DcrCheckOutTableTable> {
  $$DcrCheckOutTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get checkInId =>
      $composableBuilder(column: $table.checkInId, builder: (column) => column);

  GeneratedColumn<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => column);

  GeneratedColumn<DateTime> get checkInTime => $composableBuilder(
      column: $table.checkInTime, builder: (column) => column);

  GeneratedColumn<DateTime> get checkOutTime => $composableBuilder(
      column: $table.checkOutTime, builder: (column) => column);

  GeneratedColumn<int> get visitDurationMinutes => $composableBuilder(
      column: $table.visitDurationMinutes, builder: (column) => column);

  GeneratedColumn<double> get latitude =>
      $composableBuilder(column: $table.latitude, builder: (column) => column);

  GeneratedColumn<double> get longitude =>
      $composableBuilder(column: $table.longitude, builder: (column) => column);

  GeneratedColumn<double> get accuracy =>
      $composableBuilder(column: $table.accuracy, builder: (column) => column);

  GeneratedColumn<double> get distance =>
      $composableBuilder(column: $table.distance, builder: (column) => column);

  GeneratedColumn<String> get callStatus => $composableBuilder(
      column: $table.callStatus, builder: (column) => column);

  GeneratedColumn<String> get doctorMood => $composableBuilder(
      column: $table.doctorMood, builder: (column) => column);

  GeneratedColumn<String> get productInterest => $composableBuilder(
      column: $table.productInterest, builder: (column) => column);

  GeneratedColumn<String> get competitorActivity => $composableBuilder(
      column: $table.competitorActivity, builder: (column) => column);

  GeneratedColumn<String> get newOpportunity => $composableBuilder(
      column: $table.newOpportunity, builder: (column) => column);

  GeneratedColumn<String> get complaint =>
      $composableBuilder(column: $table.complaint, builder: (column) => column);

  GeneratedColumn<bool> get followUpRequired => $composableBuilder(
      column: $table.followUpRequired, builder: (column) => column);

  GeneratedColumn<String> get nextVisitNotes => $composableBuilder(
      column: $table.nextVisitNotes, builder: (column) => column);

  GeneratedColumn<String> get remarks =>
      $composableBuilder(column: $table.remarks, builder: (column) => column);

  GeneratedColumn<bool> get isInternetAvailable => $composableBuilder(
      column: $table.isInternetAvailable, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$DcrCheckOutTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $DcrCheckOutTableTable,
    DcrCheckOutEntry,
    $$DcrCheckOutTableTableFilterComposer,
    $$DcrCheckOutTableTableOrderingComposer,
    $$DcrCheckOutTableTableAnnotationComposer,
    $$DcrCheckOutTableTableCreateCompanionBuilder,
    $$DcrCheckOutTableTableUpdateCompanionBuilder,
    (
      DcrCheckOutEntry,
      BaseReferences<_$AppDatabase, $DcrCheckOutTableTable, DcrCheckOutEntry>
    ),
    DcrCheckOutEntry,
    PrefetchHooks Function()> {
  $$DcrCheckOutTableTableTableManager(
      _$AppDatabase db, $DcrCheckOutTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DcrCheckOutTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DcrCheckOutTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DcrCheckOutTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> checkInId = const Value.absent(),
            Value<String> customerId = const Value.absent(),
            Value<DateTime> checkInTime = const Value.absent(),
            Value<DateTime> checkOutTime = const Value.absent(),
            Value<int> visitDurationMinutes = const Value.absent(),
            Value<double> latitude = const Value.absent(),
            Value<double> longitude = const Value.absent(),
            Value<double> accuracy = const Value.absent(),
            Value<double> distance = const Value.absent(),
            Value<String> callStatus = const Value.absent(),
            Value<String?> doctorMood = const Value.absent(),
            Value<String?> productInterest = const Value.absent(),
            Value<String?> competitorActivity = const Value.absent(),
            Value<String?> newOpportunity = const Value.absent(),
            Value<String?> complaint = const Value.absent(),
            Value<bool> followUpRequired = const Value.absent(),
            Value<String?> nextVisitNotes = const Value.absent(),
            Value<String?> remarks = const Value.absent(),
            Value<bool> isInternetAvailable = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              DcrCheckOutTableCompanion(
            checkInId: checkInId,
            customerId: customerId,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            visitDurationMinutes: visitDurationMinutes,
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy,
            distance: distance,
            callStatus: callStatus,
            doctorMood: doctorMood,
            productInterest: productInterest,
            competitorActivity: competitorActivity,
            newOpportunity: newOpportunity,
            complaint: complaint,
            followUpRequired: followUpRequired,
            nextVisitNotes: nextVisitNotes,
            remarks: remarks,
            isInternetAvailable: isInternetAvailable,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String checkInId,
            required String customerId,
            required DateTime checkInTime,
            required DateTime checkOutTime,
            required int visitDurationMinutes,
            required double latitude,
            required double longitude,
            required double accuracy,
            required double distance,
            required String callStatus,
            Value<String?> doctorMood = const Value.absent(),
            Value<String?> productInterest = const Value.absent(),
            Value<String?> competitorActivity = const Value.absent(),
            Value<String?> newOpportunity = const Value.absent(),
            Value<String?> complaint = const Value.absent(),
            Value<bool> followUpRequired = const Value.absent(),
            Value<String?> nextVisitNotes = const Value.absent(),
            Value<String?> remarks = const Value.absent(),
            Value<bool> isInternetAvailable = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              DcrCheckOutTableCompanion.insert(
            checkInId: checkInId,
            customerId: customerId,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            visitDurationMinutes: visitDurationMinutes,
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy,
            distance: distance,
            callStatus: callStatus,
            doctorMood: doctorMood,
            productInterest: productInterest,
            competitorActivity: competitorActivity,
            newOpportunity: newOpportunity,
            complaint: complaint,
            followUpRequired: followUpRequired,
            nextVisitNotes: nextVisitNotes,
            remarks: remarks,
            isInternetAvailable: isInternetAvailable,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$DcrCheckOutTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $DcrCheckOutTableTable,
    DcrCheckOutEntry,
    $$DcrCheckOutTableTableFilterComposer,
    $$DcrCheckOutTableTableOrderingComposer,
    $$DcrCheckOutTableTableAnnotationComposer,
    $$DcrCheckOutTableTableCreateCompanionBuilder,
    $$DcrCheckOutTableTableUpdateCompanionBuilder,
    (
      DcrCheckOutEntry,
      BaseReferences<_$AppDatabase, $DcrCheckOutTableTable, DcrCheckOutEntry>
    ),
    DcrCheckOutEntry,
    PrefetchHooks Function()>;
typedef $$DcrReportTableTableCreateCompanionBuilder = DcrReportTableCompanion
    Function({
  required String checkInId,
  required String customerId,
  Value<String?> samplingData,
  Value<String?> prescriptionData,
  Value<String?> orderData,
  Value<String?> summaryData,
  Value<bool> isDraft,
  Value<int> syncStatus,
  Value<int> rowid,
});
typedef $$DcrReportTableTableUpdateCompanionBuilder = DcrReportTableCompanion
    Function({
  Value<String> checkInId,
  Value<String> customerId,
  Value<String?> samplingData,
  Value<String?> prescriptionData,
  Value<String?> orderData,
  Value<String?> summaryData,
  Value<bool> isDraft,
  Value<int> syncStatus,
  Value<int> rowid,
});

class $$DcrReportTableTableFilterComposer
    extends Composer<_$AppDatabase, $DcrReportTableTable> {
  $$DcrReportTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get checkInId => $composableBuilder(
      column: $table.checkInId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get samplingData => $composableBuilder(
      column: $table.samplingData, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get prescriptionData => $composableBuilder(
      column: $table.prescriptionData,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get orderData => $composableBuilder(
      column: $table.orderData, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get summaryData => $composableBuilder(
      column: $table.summaryData, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isDraft => $composableBuilder(
      column: $table.isDraft, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$DcrReportTableTableOrderingComposer
    extends Composer<_$AppDatabase, $DcrReportTableTable> {
  $$DcrReportTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get checkInId => $composableBuilder(
      column: $table.checkInId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get samplingData => $composableBuilder(
      column: $table.samplingData,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get prescriptionData => $composableBuilder(
      column: $table.prescriptionData,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get orderData => $composableBuilder(
      column: $table.orderData, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get summaryData => $composableBuilder(
      column: $table.summaryData, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isDraft => $composableBuilder(
      column: $table.isDraft, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$DcrReportTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $DcrReportTableTable> {
  $$DcrReportTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get checkInId =>
      $composableBuilder(column: $table.checkInId, builder: (column) => column);

  GeneratedColumn<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => column);

  GeneratedColumn<String> get samplingData => $composableBuilder(
      column: $table.samplingData, builder: (column) => column);

  GeneratedColumn<String> get prescriptionData => $composableBuilder(
      column: $table.prescriptionData, builder: (column) => column);

  GeneratedColumn<String> get orderData =>
      $composableBuilder(column: $table.orderData, builder: (column) => column);

  GeneratedColumn<String> get summaryData => $composableBuilder(
      column: $table.summaryData, builder: (column) => column);

  GeneratedColumn<bool> get isDraft =>
      $composableBuilder(column: $table.isDraft, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$DcrReportTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $DcrReportTableTable,
    DcrReportEntry,
    $$DcrReportTableTableFilterComposer,
    $$DcrReportTableTableOrderingComposer,
    $$DcrReportTableTableAnnotationComposer,
    $$DcrReportTableTableCreateCompanionBuilder,
    $$DcrReportTableTableUpdateCompanionBuilder,
    (
      DcrReportEntry,
      BaseReferences<_$AppDatabase, $DcrReportTableTable, DcrReportEntry>
    ),
    DcrReportEntry,
    PrefetchHooks Function()> {
  $$DcrReportTableTableTableManager(
      _$AppDatabase db, $DcrReportTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DcrReportTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DcrReportTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DcrReportTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> checkInId = const Value.absent(),
            Value<String> customerId = const Value.absent(),
            Value<String?> samplingData = const Value.absent(),
            Value<String?> prescriptionData = const Value.absent(),
            Value<String?> orderData = const Value.absent(),
            Value<String?> summaryData = const Value.absent(),
            Value<bool> isDraft = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              DcrReportTableCompanion(
            checkInId: checkInId,
            customerId: customerId,
            samplingData: samplingData,
            prescriptionData: prescriptionData,
            orderData: orderData,
            summaryData: summaryData,
            isDraft: isDraft,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String checkInId,
            required String customerId,
            Value<String?> samplingData = const Value.absent(),
            Value<String?> prescriptionData = const Value.absent(),
            Value<String?> orderData = const Value.absent(),
            Value<String?> summaryData = const Value.absent(),
            Value<bool> isDraft = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              DcrReportTableCompanion.insert(
            checkInId: checkInId,
            customerId: customerId,
            samplingData: samplingData,
            prescriptionData: prescriptionData,
            orderData: orderData,
            summaryData: summaryData,
            isDraft: isDraft,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$DcrReportTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $DcrReportTableTable,
    DcrReportEntry,
    $$DcrReportTableTableFilterComposer,
    $$DcrReportTableTableOrderingComposer,
    $$DcrReportTableTableAnnotationComposer,
    $$DcrReportTableTableCreateCompanionBuilder,
    $$DcrReportTableTableUpdateCompanionBuilder,
    (
      DcrReportEntry,
      BaseReferences<_$AppDatabase, $DcrReportTableTable, DcrReportEntry>
    ),
    DcrReportEntry,
    PrefetchHooks Function()>;
typedef $$DcrSubmissionTableTableCreateCompanionBuilder
    = DcrSubmissionTableCompanion Function({
  required String dcrId,
  required String checkInId,
  required String customerId,
  required DateTime submissionTime,
  Value<bool> isJointWork,
  Value<String?> taggedManagers,
  Value<bool> isLocked,
  required String createdBy,
  Value<String?> deviceId,
  Value<String?> appVersion,
  required double latitude,
  required double longitude,
  Value<int> syncStatus,
  Value<int> rowid,
});
typedef $$DcrSubmissionTableTableUpdateCompanionBuilder
    = DcrSubmissionTableCompanion Function({
  Value<String> dcrId,
  Value<String> checkInId,
  Value<String> customerId,
  Value<DateTime> submissionTime,
  Value<bool> isJointWork,
  Value<String?> taggedManagers,
  Value<bool> isLocked,
  Value<String> createdBy,
  Value<String?> deviceId,
  Value<String?> appVersion,
  Value<double> latitude,
  Value<double> longitude,
  Value<int> syncStatus,
  Value<int> rowid,
});

class $$DcrSubmissionTableTableFilterComposer
    extends Composer<_$AppDatabase, $DcrSubmissionTableTable> {
  $$DcrSubmissionTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get dcrId => $composableBuilder(
      column: $table.dcrId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get checkInId => $composableBuilder(
      column: $table.checkInId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get submissionTime => $composableBuilder(
      column: $table.submissionTime,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isJointWork => $composableBuilder(
      column: $table.isJointWork, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get taggedManagers => $composableBuilder(
      column: $table.taggedManagers,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isLocked => $composableBuilder(
      column: $table.isLocked, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get createdBy => $composableBuilder(
      column: $table.createdBy, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get deviceId => $composableBuilder(
      column: $table.deviceId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get appVersion => $composableBuilder(
      column: $table.appVersion, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$DcrSubmissionTableTableOrderingComposer
    extends Composer<_$AppDatabase, $DcrSubmissionTableTable> {
  $$DcrSubmissionTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get dcrId => $composableBuilder(
      column: $table.dcrId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get checkInId => $composableBuilder(
      column: $table.checkInId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get submissionTime => $composableBuilder(
      column: $table.submissionTime,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isJointWork => $composableBuilder(
      column: $table.isJointWork, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get taggedManagers => $composableBuilder(
      column: $table.taggedManagers,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isLocked => $composableBuilder(
      column: $table.isLocked, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get createdBy => $composableBuilder(
      column: $table.createdBy, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get deviceId => $composableBuilder(
      column: $table.deviceId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get appVersion => $composableBuilder(
      column: $table.appVersion, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$DcrSubmissionTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $DcrSubmissionTableTable> {
  $$DcrSubmissionTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get dcrId =>
      $composableBuilder(column: $table.dcrId, builder: (column) => column);

  GeneratedColumn<String> get checkInId =>
      $composableBuilder(column: $table.checkInId, builder: (column) => column);

  GeneratedColumn<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => column);

  GeneratedColumn<DateTime> get submissionTime => $composableBuilder(
      column: $table.submissionTime, builder: (column) => column);

  GeneratedColumn<bool> get isJointWork => $composableBuilder(
      column: $table.isJointWork, builder: (column) => column);

  GeneratedColumn<String> get taggedManagers => $composableBuilder(
      column: $table.taggedManagers, builder: (column) => column);

  GeneratedColumn<bool> get isLocked =>
      $composableBuilder(column: $table.isLocked, builder: (column) => column);

  GeneratedColumn<String> get createdBy =>
      $composableBuilder(column: $table.createdBy, builder: (column) => column);

  GeneratedColumn<String> get deviceId =>
      $composableBuilder(column: $table.deviceId, builder: (column) => column);

  GeneratedColumn<String> get appVersion => $composableBuilder(
      column: $table.appVersion, builder: (column) => column);

  GeneratedColumn<double> get latitude =>
      $composableBuilder(column: $table.latitude, builder: (column) => column);

  GeneratedColumn<double> get longitude =>
      $composableBuilder(column: $table.longitude, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$DcrSubmissionTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $DcrSubmissionTableTable,
    DcrSubmissionEntry,
    $$DcrSubmissionTableTableFilterComposer,
    $$DcrSubmissionTableTableOrderingComposer,
    $$DcrSubmissionTableTableAnnotationComposer,
    $$DcrSubmissionTableTableCreateCompanionBuilder,
    $$DcrSubmissionTableTableUpdateCompanionBuilder,
    (
      DcrSubmissionEntry,
      BaseReferences<_$AppDatabase, $DcrSubmissionTableTable,
          DcrSubmissionEntry>
    ),
    DcrSubmissionEntry,
    PrefetchHooks Function()> {
  $$DcrSubmissionTableTableTableManager(
      _$AppDatabase db, $DcrSubmissionTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DcrSubmissionTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DcrSubmissionTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DcrSubmissionTableTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> dcrId = const Value.absent(),
            Value<String> checkInId = const Value.absent(),
            Value<String> customerId = const Value.absent(),
            Value<DateTime> submissionTime = const Value.absent(),
            Value<bool> isJointWork = const Value.absent(),
            Value<String?> taggedManagers = const Value.absent(),
            Value<bool> isLocked = const Value.absent(),
            Value<String> createdBy = const Value.absent(),
            Value<String?> deviceId = const Value.absent(),
            Value<String?> appVersion = const Value.absent(),
            Value<double> latitude = const Value.absent(),
            Value<double> longitude = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              DcrSubmissionTableCompanion(
            dcrId: dcrId,
            checkInId: checkInId,
            customerId: customerId,
            submissionTime: submissionTime,
            isJointWork: isJointWork,
            taggedManagers: taggedManagers,
            isLocked: isLocked,
            createdBy: createdBy,
            deviceId: deviceId,
            appVersion: appVersion,
            latitude: latitude,
            longitude: longitude,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String dcrId,
            required String checkInId,
            required String customerId,
            required DateTime submissionTime,
            Value<bool> isJointWork = const Value.absent(),
            Value<String?> taggedManagers = const Value.absent(),
            Value<bool> isLocked = const Value.absent(),
            required String createdBy,
            Value<String?> deviceId = const Value.absent(),
            Value<String?> appVersion = const Value.absent(),
            required double latitude,
            required double longitude,
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              DcrSubmissionTableCompanion.insert(
            dcrId: dcrId,
            checkInId: checkInId,
            customerId: customerId,
            submissionTime: submissionTime,
            isJointWork: isJointWork,
            taggedManagers: taggedManagers,
            isLocked: isLocked,
            createdBy: createdBy,
            deviceId: deviceId,
            appVersion: appVersion,
            latitude: latitude,
            longitude: longitude,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$DcrSubmissionTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $DcrSubmissionTableTable,
    DcrSubmissionEntry,
    $$DcrSubmissionTableTableFilterComposer,
    $$DcrSubmissionTableTableOrderingComposer,
    $$DcrSubmissionTableTableAnnotationComposer,
    $$DcrSubmissionTableTableCreateCompanionBuilder,
    $$DcrSubmissionTableTableUpdateCompanionBuilder,
    (
      DcrSubmissionEntry,
      BaseReferences<_$AppDatabase, $DcrSubmissionTableTable,
          DcrSubmissionEntry>
    ),
    DcrSubmissionEntry,
    PrefetchHooks Function()>;
typedef $$DeviationTableTableCreateCompanionBuilder = DeviationTableCompanion
    Function({
  Value<int> id,
  required String employeeId,
  required String customerId,
  required String reason,
  Value<String?> remarks,
  Value<DateTime> deviationDate,
  Value<int> syncStatus,
});
typedef $$DeviationTableTableUpdateCompanionBuilder = DeviationTableCompanion
    Function({
  Value<int> id,
  Value<String> employeeId,
  Value<String> customerId,
  Value<String> reason,
  Value<String?> remarks,
  Value<DateTime> deviationDate,
  Value<int> syncStatus,
});

class $$DeviationTableTableFilterComposer
    extends Composer<_$AppDatabase, $DeviationTableTable> {
  $$DeviationTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get reason => $composableBuilder(
      column: $table.reason, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get remarks => $composableBuilder(
      column: $table.remarks, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get deviationDate => $composableBuilder(
      column: $table.deviationDate, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$DeviationTableTableOrderingComposer
    extends Composer<_$AppDatabase, $DeviationTableTable> {
  $$DeviationTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get reason => $composableBuilder(
      column: $table.reason, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get remarks => $composableBuilder(
      column: $table.remarks, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get deviationDate => $composableBuilder(
      column: $table.deviationDate,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$DeviationTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $DeviationTableTable> {
  $$DeviationTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => column);

  GeneratedColumn<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => column);

  GeneratedColumn<String> get reason =>
      $composableBuilder(column: $table.reason, builder: (column) => column);

  GeneratedColumn<String> get remarks =>
      $composableBuilder(column: $table.remarks, builder: (column) => column);

  GeneratedColumn<DateTime> get deviationDate => $composableBuilder(
      column: $table.deviationDate, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$DeviationTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $DeviationTableTable,
    DeviationEntry,
    $$DeviationTableTableFilterComposer,
    $$DeviationTableTableOrderingComposer,
    $$DeviationTableTableAnnotationComposer,
    $$DeviationTableTableCreateCompanionBuilder,
    $$DeviationTableTableUpdateCompanionBuilder,
    (
      DeviationEntry,
      BaseReferences<_$AppDatabase, $DeviationTableTable, DeviationEntry>
    ),
    DeviationEntry,
    PrefetchHooks Function()> {
  $$DeviationTableTableTableManager(
      _$AppDatabase db, $DeviationTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DeviationTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DeviationTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DeviationTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> employeeId = const Value.absent(),
            Value<String> customerId = const Value.absent(),
            Value<String> reason = const Value.absent(),
            Value<String?> remarks = const Value.absent(),
            Value<DateTime> deviationDate = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
          }) =>
              DeviationTableCompanion(
            id: id,
            employeeId: employeeId,
            customerId: customerId,
            reason: reason,
            remarks: remarks,
            deviationDate: deviationDate,
            syncStatus: syncStatus,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String employeeId,
            required String customerId,
            required String reason,
            Value<String?> remarks = const Value.absent(),
            Value<DateTime> deviationDate = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
          }) =>
              DeviationTableCompanion.insert(
            id: id,
            employeeId: employeeId,
            customerId: customerId,
            reason: reason,
            remarks: remarks,
            deviationDate: deviationDate,
            syncStatus: syncStatus,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$DeviationTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $DeviationTableTable,
    DeviationEntry,
    $$DeviationTableTableFilterComposer,
    $$DeviationTableTableOrderingComposer,
    $$DeviationTableTableAnnotationComposer,
    $$DeviationTableTableCreateCompanionBuilder,
    $$DeviationTableTableUpdateCompanionBuilder,
    (
      DeviationEntry,
      BaseReferences<_$AppDatabase, $DeviationTableTable, DeviationEntry>
    ),
    DeviationEntry,
    PrefetchHooks Function()>;
typedef $$ExpenseApprovalTableTableCreateCompanionBuilder
    = ExpenseApprovalTableCompanion Function({
  required String id,
  required String expenseId,
  required String approverId,
  required String approverRole,
  required String status,
  required double claimAmount,
  Value<double?> approvedAmount,
  Value<double?> rejectedAmount,
  Value<String?> adjustmentReason,
  Value<String?> remarks,
  Value<int> syncStatus,
  Value<int> rowid,
});
typedef $$ExpenseApprovalTableTableUpdateCompanionBuilder
    = ExpenseApprovalTableCompanion Function({
  Value<String> id,
  Value<String> expenseId,
  Value<String> approverId,
  Value<String> approverRole,
  Value<String> status,
  Value<double> claimAmount,
  Value<double?> approvedAmount,
  Value<double?> rejectedAmount,
  Value<String?> adjustmentReason,
  Value<String?> remarks,
  Value<int> syncStatus,
  Value<int> rowid,
});

class $$ExpenseApprovalTableTableFilterComposer
    extends Composer<_$AppDatabase, $ExpenseApprovalTableTable> {
  $$ExpenseApprovalTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get expenseId => $composableBuilder(
      column: $table.expenseId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get approverId => $composableBuilder(
      column: $table.approverId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get approverRole => $composableBuilder(
      column: $table.approverRole, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get claimAmount => $composableBuilder(
      column: $table.claimAmount, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get approvedAmount => $composableBuilder(
      column: $table.approvedAmount,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get rejectedAmount => $composableBuilder(
      column: $table.rejectedAmount,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get adjustmentReason => $composableBuilder(
      column: $table.adjustmentReason,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get remarks => $composableBuilder(
      column: $table.remarks, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$ExpenseApprovalTableTableOrderingComposer
    extends Composer<_$AppDatabase, $ExpenseApprovalTableTable> {
  $$ExpenseApprovalTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get expenseId => $composableBuilder(
      column: $table.expenseId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get approverId => $composableBuilder(
      column: $table.approverId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get approverRole => $composableBuilder(
      column: $table.approverRole,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get claimAmount => $composableBuilder(
      column: $table.claimAmount, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get approvedAmount => $composableBuilder(
      column: $table.approvedAmount,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get rejectedAmount => $composableBuilder(
      column: $table.rejectedAmount,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get adjustmentReason => $composableBuilder(
      column: $table.adjustmentReason,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get remarks => $composableBuilder(
      column: $table.remarks, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$ExpenseApprovalTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $ExpenseApprovalTableTable> {
  $$ExpenseApprovalTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get expenseId =>
      $composableBuilder(column: $table.expenseId, builder: (column) => column);

  GeneratedColumn<String> get approverId => $composableBuilder(
      column: $table.approverId, builder: (column) => column);

  GeneratedColumn<String> get approverRole => $composableBuilder(
      column: $table.approverRole, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<double> get claimAmount => $composableBuilder(
      column: $table.claimAmount, builder: (column) => column);

  GeneratedColumn<double> get approvedAmount => $composableBuilder(
      column: $table.approvedAmount, builder: (column) => column);

  GeneratedColumn<double> get rejectedAmount => $composableBuilder(
      column: $table.rejectedAmount, builder: (column) => column);

  GeneratedColumn<String> get adjustmentReason => $composableBuilder(
      column: $table.adjustmentReason, builder: (column) => column);

  GeneratedColumn<String> get remarks =>
      $composableBuilder(column: $table.remarks, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$ExpenseApprovalTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $ExpenseApprovalTableTable,
    ExpenseApprovalEntry,
    $$ExpenseApprovalTableTableFilterComposer,
    $$ExpenseApprovalTableTableOrderingComposer,
    $$ExpenseApprovalTableTableAnnotationComposer,
    $$ExpenseApprovalTableTableCreateCompanionBuilder,
    $$ExpenseApprovalTableTableUpdateCompanionBuilder,
    (
      ExpenseApprovalEntry,
      BaseReferences<_$AppDatabase, $ExpenseApprovalTableTable,
          ExpenseApprovalEntry>
    ),
    ExpenseApprovalEntry,
    PrefetchHooks Function()> {
  $$ExpenseApprovalTableTableTableManager(
      _$AppDatabase db, $ExpenseApprovalTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ExpenseApprovalTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ExpenseApprovalTableTableOrderingComposer(
                  $db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ExpenseApprovalTableTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> expenseId = const Value.absent(),
            Value<String> approverId = const Value.absent(),
            Value<String> approverRole = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<double> claimAmount = const Value.absent(),
            Value<double?> approvedAmount = const Value.absent(),
            Value<double?> rejectedAmount = const Value.absent(),
            Value<String?> adjustmentReason = const Value.absent(),
            Value<String?> remarks = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ExpenseApprovalTableCompanion(
            id: id,
            expenseId: expenseId,
            approverId: approverId,
            approverRole: approverRole,
            status: status,
            claimAmount: claimAmount,
            approvedAmount: approvedAmount,
            rejectedAmount: rejectedAmount,
            adjustmentReason: adjustmentReason,
            remarks: remarks,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String expenseId,
            required String approverId,
            required String approverRole,
            required String status,
            required double claimAmount,
            Value<double?> approvedAmount = const Value.absent(),
            Value<double?> rejectedAmount = const Value.absent(),
            Value<String?> adjustmentReason = const Value.absent(),
            Value<String?> remarks = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ExpenseApprovalTableCompanion.insert(
            id: id,
            expenseId: expenseId,
            approverId: approverId,
            approverRole: approverRole,
            status: status,
            claimAmount: claimAmount,
            approvedAmount: approvedAmount,
            rejectedAmount: rejectedAmount,
            adjustmentReason: adjustmentReason,
            remarks: remarks,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$ExpenseApprovalTableTableProcessedTableManager
    = ProcessedTableManager<
        _$AppDatabase,
        $ExpenseApprovalTableTable,
        ExpenseApprovalEntry,
        $$ExpenseApprovalTableTableFilterComposer,
        $$ExpenseApprovalTableTableOrderingComposer,
        $$ExpenseApprovalTableTableAnnotationComposer,
        $$ExpenseApprovalTableTableCreateCompanionBuilder,
        $$ExpenseApprovalTableTableUpdateCompanionBuilder,
        (
          ExpenseApprovalEntry,
          BaseReferences<_$AppDatabase, $ExpenseApprovalTableTable,
              ExpenseApprovalEntry>
        ),
        ExpenseApprovalEntry,
        PrefetchHooks Function()>;
typedef $$ExpenseAuditTableTableCreateCompanionBuilder
    = ExpenseAuditTableCompanion Function({
  required String id,
  required String expenseId,
  required String action,
  required String performedBy,
  required String role,
  required String timestamp,
  Value<String?> deviceId,
  Value<String?> details,
  Value<int> syncStatus,
  Value<int> rowid,
});
typedef $$ExpenseAuditTableTableUpdateCompanionBuilder
    = ExpenseAuditTableCompanion Function({
  Value<String> id,
  Value<String> expenseId,
  Value<String> action,
  Value<String> performedBy,
  Value<String> role,
  Value<String> timestamp,
  Value<String?> deviceId,
  Value<String?> details,
  Value<int> syncStatus,
  Value<int> rowid,
});

class $$ExpenseAuditTableTableFilterComposer
    extends Composer<_$AppDatabase, $ExpenseAuditTableTable> {
  $$ExpenseAuditTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get expenseId => $composableBuilder(
      column: $table.expenseId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get action => $composableBuilder(
      column: $table.action, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get performedBy => $composableBuilder(
      column: $table.performedBy, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get role => $composableBuilder(
      column: $table.role, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get timestamp => $composableBuilder(
      column: $table.timestamp, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get deviceId => $composableBuilder(
      column: $table.deviceId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get details => $composableBuilder(
      column: $table.details, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$ExpenseAuditTableTableOrderingComposer
    extends Composer<_$AppDatabase, $ExpenseAuditTableTable> {
  $$ExpenseAuditTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get expenseId => $composableBuilder(
      column: $table.expenseId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get action => $composableBuilder(
      column: $table.action, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get performedBy => $composableBuilder(
      column: $table.performedBy, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get role => $composableBuilder(
      column: $table.role, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get timestamp => $composableBuilder(
      column: $table.timestamp, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get deviceId => $composableBuilder(
      column: $table.deviceId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get details => $composableBuilder(
      column: $table.details, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$ExpenseAuditTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $ExpenseAuditTableTable> {
  $$ExpenseAuditTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get expenseId =>
      $composableBuilder(column: $table.expenseId, builder: (column) => column);

  GeneratedColumn<String> get action =>
      $composableBuilder(column: $table.action, builder: (column) => column);

  GeneratedColumn<String> get performedBy => $composableBuilder(
      column: $table.performedBy, builder: (column) => column);

  GeneratedColumn<String> get role =>
      $composableBuilder(column: $table.role, builder: (column) => column);

  GeneratedColumn<String> get timestamp =>
      $composableBuilder(column: $table.timestamp, builder: (column) => column);

  GeneratedColumn<String> get deviceId =>
      $composableBuilder(column: $table.deviceId, builder: (column) => column);

  GeneratedColumn<String> get details =>
      $composableBuilder(column: $table.details, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$ExpenseAuditTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $ExpenseAuditTableTable,
    ExpenseAuditEntry,
    $$ExpenseAuditTableTableFilterComposer,
    $$ExpenseAuditTableTableOrderingComposer,
    $$ExpenseAuditTableTableAnnotationComposer,
    $$ExpenseAuditTableTableCreateCompanionBuilder,
    $$ExpenseAuditTableTableUpdateCompanionBuilder,
    (
      ExpenseAuditEntry,
      BaseReferences<_$AppDatabase, $ExpenseAuditTableTable, ExpenseAuditEntry>
    ),
    ExpenseAuditEntry,
    PrefetchHooks Function()> {
  $$ExpenseAuditTableTableTableManager(
      _$AppDatabase db, $ExpenseAuditTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ExpenseAuditTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ExpenseAuditTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ExpenseAuditTableTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> expenseId = const Value.absent(),
            Value<String> action = const Value.absent(),
            Value<String> performedBy = const Value.absent(),
            Value<String> role = const Value.absent(),
            Value<String> timestamp = const Value.absent(),
            Value<String?> deviceId = const Value.absent(),
            Value<String?> details = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ExpenseAuditTableCompanion(
            id: id,
            expenseId: expenseId,
            action: action,
            performedBy: performedBy,
            role: role,
            timestamp: timestamp,
            deviceId: deviceId,
            details: details,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String expenseId,
            required String action,
            required String performedBy,
            required String role,
            required String timestamp,
            Value<String?> deviceId = const Value.absent(),
            Value<String?> details = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ExpenseAuditTableCompanion.insert(
            id: id,
            expenseId: expenseId,
            action: action,
            performedBy: performedBy,
            role: role,
            timestamp: timestamp,
            deviceId: deviceId,
            details: details,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$ExpenseAuditTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $ExpenseAuditTableTable,
    ExpenseAuditEntry,
    $$ExpenseAuditTableTableFilterComposer,
    $$ExpenseAuditTableTableOrderingComposer,
    $$ExpenseAuditTableTableAnnotationComposer,
    $$ExpenseAuditTableTableCreateCompanionBuilder,
    $$ExpenseAuditTableTableUpdateCompanionBuilder,
    (
      ExpenseAuditEntry,
      BaseReferences<_$AppDatabase, $ExpenseAuditTableTable, ExpenseAuditEntry>
    ),
    ExpenseAuditEntry,
    PrefetchHooks Function()>;
typedef $$ExpenseBillTableTableCreateCompanionBuilder
    = ExpenseBillTableCompanion Function({
  required String id,
  required String expenseId,
  required String filePath,
  required String fileName,
  required String fileType,
  required int fileSize,
  Value<int> syncStatus,
  Value<int> rowid,
});
typedef $$ExpenseBillTableTableUpdateCompanionBuilder
    = ExpenseBillTableCompanion Function({
  Value<String> id,
  Value<String> expenseId,
  Value<String> filePath,
  Value<String> fileName,
  Value<String> fileType,
  Value<int> fileSize,
  Value<int> syncStatus,
  Value<int> rowid,
});

class $$ExpenseBillTableTableFilterComposer
    extends Composer<_$AppDatabase, $ExpenseBillTableTable> {
  $$ExpenseBillTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get expenseId => $composableBuilder(
      column: $table.expenseId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get filePath => $composableBuilder(
      column: $table.filePath, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get fileName => $composableBuilder(
      column: $table.fileName, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get fileType => $composableBuilder(
      column: $table.fileType, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get fileSize => $composableBuilder(
      column: $table.fileSize, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$ExpenseBillTableTableOrderingComposer
    extends Composer<_$AppDatabase, $ExpenseBillTableTable> {
  $$ExpenseBillTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get expenseId => $composableBuilder(
      column: $table.expenseId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get filePath => $composableBuilder(
      column: $table.filePath, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get fileName => $composableBuilder(
      column: $table.fileName, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get fileType => $composableBuilder(
      column: $table.fileType, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get fileSize => $composableBuilder(
      column: $table.fileSize, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$ExpenseBillTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $ExpenseBillTableTable> {
  $$ExpenseBillTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get expenseId =>
      $composableBuilder(column: $table.expenseId, builder: (column) => column);

  GeneratedColumn<String> get filePath =>
      $composableBuilder(column: $table.filePath, builder: (column) => column);

  GeneratedColumn<String> get fileName =>
      $composableBuilder(column: $table.fileName, builder: (column) => column);

  GeneratedColumn<String> get fileType =>
      $composableBuilder(column: $table.fileType, builder: (column) => column);

  GeneratedColumn<int> get fileSize =>
      $composableBuilder(column: $table.fileSize, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$ExpenseBillTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $ExpenseBillTableTable,
    ExpenseBillEntry,
    $$ExpenseBillTableTableFilterComposer,
    $$ExpenseBillTableTableOrderingComposer,
    $$ExpenseBillTableTableAnnotationComposer,
    $$ExpenseBillTableTableCreateCompanionBuilder,
    $$ExpenseBillTableTableUpdateCompanionBuilder,
    (
      ExpenseBillEntry,
      BaseReferences<_$AppDatabase, $ExpenseBillTableTable, ExpenseBillEntry>
    ),
    ExpenseBillEntry,
    PrefetchHooks Function()> {
  $$ExpenseBillTableTableTableManager(
      _$AppDatabase db, $ExpenseBillTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ExpenseBillTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ExpenseBillTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ExpenseBillTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> expenseId = const Value.absent(),
            Value<String> filePath = const Value.absent(),
            Value<String> fileName = const Value.absent(),
            Value<String> fileType = const Value.absent(),
            Value<int> fileSize = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ExpenseBillTableCompanion(
            id: id,
            expenseId: expenseId,
            filePath: filePath,
            fileName: fileName,
            fileType: fileType,
            fileSize: fileSize,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String expenseId,
            required String filePath,
            required String fileName,
            required String fileType,
            required int fileSize,
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ExpenseBillTableCompanion.insert(
            id: id,
            expenseId: expenseId,
            filePath: filePath,
            fileName: fileName,
            fileType: fileType,
            fileSize: fileSize,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$ExpenseBillTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $ExpenseBillTableTable,
    ExpenseBillEntry,
    $$ExpenseBillTableTableFilterComposer,
    $$ExpenseBillTableTableOrderingComposer,
    $$ExpenseBillTableTableAnnotationComposer,
    $$ExpenseBillTableTableCreateCompanionBuilder,
    $$ExpenseBillTableTableUpdateCompanionBuilder,
    (
      ExpenseBillEntry,
      BaseReferences<_$AppDatabase, $ExpenseBillTableTable, ExpenseBillEntry>
    ),
    ExpenseBillEntry,
    PrefetchHooks Function()>;
typedef $$ExpensePaymentTableTableCreateCompanionBuilder
    = ExpensePaymentTableCompanion Function({
  required String id,
  required String expenseId,
  required String financeId,
  required String paymentDate,
  required String paymentMode,
  Value<String?> transactionNumber,
  Value<String?> referenceNumber,
  required String status,
  Value<int> syncStatus,
  Value<int> rowid,
});
typedef $$ExpensePaymentTableTableUpdateCompanionBuilder
    = ExpensePaymentTableCompanion Function({
  Value<String> id,
  Value<String> expenseId,
  Value<String> financeId,
  Value<String> paymentDate,
  Value<String> paymentMode,
  Value<String?> transactionNumber,
  Value<String?> referenceNumber,
  Value<String> status,
  Value<int> syncStatus,
  Value<int> rowid,
});

class $$ExpensePaymentTableTableFilterComposer
    extends Composer<_$AppDatabase, $ExpensePaymentTableTable> {
  $$ExpensePaymentTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get expenseId => $composableBuilder(
      column: $table.expenseId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get financeId => $composableBuilder(
      column: $table.financeId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get paymentDate => $composableBuilder(
      column: $table.paymentDate, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get paymentMode => $composableBuilder(
      column: $table.paymentMode, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get transactionNumber => $composableBuilder(
      column: $table.transactionNumber,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get referenceNumber => $composableBuilder(
      column: $table.referenceNumber,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$ExpensePaymentTableTableOrderingComposer
    extends Composer<_$AppDatabase, $ExpensePaymentTableTable> {
  $$ExpensePaymentTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get expenseId => $composableBuilder(
      column: $table.expenseId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get financeId => $composableBuilder(
      column: $table.financeId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get paymentDate => $composableBuilder(
      column: $table.paymentDate, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get paymentMode => $composableBuilder(
      column: $table.paymentMode, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get transactionNumber => $composableBuilder(
      column: $table.transactionNumber,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get referenceNumber => $composableBuilder(
      column: $table.referenceNumber,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$ExpensePaymentTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $ExpensePaymentTableTable> {
  $$ExpensePaymentTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get expenseId =>
      $composableBuilder(column: $table.expenseId, builder: (column) => column);

  GeneratedColumn<String> get financeId =>
      $composableBuilder(column: $table.financeId, builder: (column) => column);

  GeneratedColumn<String> get paymentDate => $composableBuilder(
      column: $table.paymentDate, builder: (column) => column);

  GeneratedColumn<String> get paymentMode => $composableBuilder(
      column: $table.paymentMode, builder: (column) => column);

  GeneratedColumn<String> get transactionNumber => $composableBuilder(
      column: $table.transactionNumber, builder: (column) => column);

  GeneratedColumn<String> get referenceNumber => $composableBuilder(
      column: $table.referenceNumber, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$ExpensePaymentTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $ExpensePaymentTableTable,
    ExpensePaymentEntry,
    $$ExpensePaymentTableTableFilterComposer,
    $$ExpensePaymentTableTableOrderingComposer,
    $$ExpensePaymentTableTableAnnotationComposer,
    $$ExpensePaymentTableTableCreateCompanionBuilder,
    $$ExpensePaymentTableTableUpdateCompanionBuilder,
    (
      ExpensePaymentEntry,
      BaseReferences<_$AppDatabase, $ExpensePaymentTableTable,
          ExpensePaymentEntry>
    ),
    ExpensePaymentEntry,
    PrefetchHooks Function()> {
  $$ExpensePaymentTableTableTableManager(
      _$AppDatabase db, $ExpensePaymentTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ExpensePaymentTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ExpensePaymentTableTableOrderingComposer(
                  $db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ExpensePaymentTableTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> expenseId = const Value.absent(),
            Value<String> financeId = const Value.absent(),
            Value<String> paymentDate = const Value.absent(),
            Value<String> paymentMode = const Value.absent(),
            Value<String?> transactionNumber = const Value.absent(),
            Value<String?> referenceNumber = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ExpensePaymentTableCompanion(
            id: id,
            expenseId: expenseId,
            financeId: financeId,
            paymentDate: paymentDate,
            paymentMode: paymentMode,
            transactionNumber: transactionNumber,
            referenceNumber: referenceNumber,
            status: status,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String expenseId,
            required String financeId,
            required String paymentDate,
            required String paymentMode,
            Value<String?> transactionNumber = const Value.absent(),
            Value<String?> referenceNumber = const Value.absent(),
            required String status,
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ExpensePaymentTableCompanion.insert(
            id: id,
            expenseId: expenseId,
            financeId: financeId,
            paymentDate: paymentDate,
            paymentMode: paymentMode,
            transactionNumber: transactionNumber,
            referenceNumber: referenceNumber,
            status: status,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$ExpensePaymentTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $ExpensePaymentTableTable,
    ExpensePaymentEntry,
    $$ExpensePaymentTableTableFilterComposer,
    $$ExpensePaymentTableTableOrderingComposer,
    $$ExpensePaymentTableTableAnnotationComposer,
    $$ExpensePaymentTableTableCreateCompanionBuilder,
    $$ExpensePaymentTableTableUpdateCompanionBuilder,
    (
      ExpensePaymentEntry,
      BaseReferences<_$AppDatabase, $ExpensePaymentTableTable,
          ExpensePaymentEntry>
    ),
    ExpensePaymentEntry,
    PrefetchHooks Function()>;
typedef $$ExpenseTableTableCreateCompanionBuilder = ExpenseTableCompanion
    Function({
  required String id,
  required DateTime date,
  required String locationType,
  Value<double> daAmount,
  required String taType,
  Value<double> taDistance,
  Value<double> taRate,
  Value<double> taAmount,
  Value<double> miscTotal,
  Value<double> grandTotal,
  Value<String> status,
  Value<int> syncStatus,
  Value<int> rowid,
});
typedef $$ExpenseTableTableUpdateCompanionBuilder = ExpenseTableCompanion
    Function({
  Value<String> id,
  Value<DateTime> date,
  Value<String> locationType,
  Value<double> daAmount,
  Value<String> taType,
  Value<double> taDistance,
  Value<double> taRate,
  Value<double> taAmount,
  Value<double> miscTotal,
  Value<double> grandTotal,
  Value<String> status,
  Value<int> syncStatus,
  Value<int> rowid,
});

class $$ExpenseTableTableFilterComposer
    extends Composer<_$AppDatabase, $ExpenseTableTable> {
  $$ExpenseTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get locationType => $composableBuilder(
      column: $table.locationType, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get daAmount => $composableBuilder(
      column: $table.daAmount, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get taType => $composableBuilder(
      column: $table.taType, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get taDistance => $composableBuilder(
      column: $table.taDistance, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get taRate => $composableBuilder(
      column: $table.taRate, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get taAmount => $composableBuilder(
      column: $table.taAmount, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get miscTotal => $composableBuilder(
      column: $table.miscTotal, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get grandTotal => $composableBuilder(
      column: $table.grandTotal, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$ExpenseTableTableOrderingComposer
    extends Composer<_$AppDatabase, $ExpenseTableTable> {
  $$ExpenseTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get locationType => $composableBuilder(
      column: $table.locationType,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get daAmount => $composableBuilder(
      column: $table.daAmount, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get taType => $composableBuilder(
      column: $table.taType, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get taDistance => $composableBuilder(
      column: $table.taDistance, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get taRate => $composableBuilder(
      column: $table.taRate, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get taAmount => $composableBuilder(
      column: $table.taAmount, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get miscTotal => $composableBuilder(
      column: $table.miscTotal, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get grandTotal => $composableBuilder(
      column: $table.grandTotal, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$ExpenseTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $ExpenseTableTable> {
  $$ExpenseTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<DateTime> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<String> get locationType => $composableBuilder(
      column: $table.locationType, builder: (column) => column);

  GeneratedColumn<double> get daAmount =>
      $composableBuilder(column: $table.daAmount, builder: (column) => column);

  GeneratedColumn<String> get taType =>
      $composableBuilder(column: $table.taType, builder: (column) => column);

  GeneratedColumn<double> get taDistance => $composableBuilder(
      column: $table.taDistance, builder: (column) => column);

  GeneratedColumn<double> get taRate =>
      $composableBuilder(column: $table.taRate, builder: (column) => column);

  GeneratedColumn<double> get taAmount =>
      $composableBuilder(column: $table.taAmount, builder: (column) => column);

  GeneratedColumn<double> get miscTotal =>
      $composableBuilder(column: $table.miscTotal, builder: (column) => column);

  GeneratedColumn<double> get grandTotal => $composableBuilder(
      column: $table.grandTotal, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$ExpenseTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $ExpenseTableTable,
    ExpenseEntry,
    $$ExpenseTableTableFilterComposer,
    $$ExpenseTableTableOrderingComposer,
    $$ExpenseTableTableAnnotationComposer,
    $$ExpenseTableTableCreateCompanionBuilder,
    $$ExpenseTableTableUpdateCompanionBuilder,
    (
      ExpenseEntry,
      BaseReferences<_$AppDatabase, $ExpenseTableTable, ExpenseEntry>
    ),
    ExpenseEntry,
    PrefetchHooks Function()> {
  $$ExpenseTableTableTableManager(_$AppDatabase db, $ExpenseTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ExpenseTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ExpenseTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ExpenseTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<DateTime> date = const Value.absent(),
            Value<String> locationType = const Value.absent(),
            Value<double> daAmount = const Value.absent(),
            Value<String> taType = const Value.absent(),
            Value<double> taDistance = const Value.absent(),
            Value<double> taRate = const Value.absent(),
            Value<double> taAmount = const Value.absent(),
            Value<double> miscTotal = const Value.absent(),
            Value<double> grandTotal = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ExpenseTableCompanion(
            id: id,
            date: date,
            locationType: locationType,
            daAmount: daAmount,
            taType: taType,
            taDistance: taDistance,
            taRate: taRate,
            taAmount: taAmount,
            miscTotal: miscTotal,
            grandTotal: grandTotal,
            status: status,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required DateTime date,
            required String locationType,
            Value<double> daAmount = const Value.absent(),
            required String taType,
            Value<double> taDistance = const Value.absent(),
            Value<double> taRate = const Value.absent(),
            Value<double> taAmount = const Value.absent(),
            Value<double> miscTotal = const Value.absent(),
            Value<double> grandTotal = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ExpenseTableCompanion.insert(
            id: id,
            date: date,
            locationType: locationType,
            daAmount: daAmount,
            taType: taType,
            taDistance: taDistance,
            taRate: taRate,
            taAmount: taAmount,
            miscTotal: miscTotal,
            grandTotal: grandTotal,
            status: status,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$ExpenseTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $ExpenseTableTable,
    ExpenseEntry,
    $$ExpenseTableTableFilterComposer,
    $$ExpenseTableTableOrderingComposer,
    $$ExpenseTableTableAnnotationComposer,
    $$ExpenseTableTableCreateCompanionBuilder,
    $$ExpenseTableTableUpdateCompanionBuilder,
    (
      ExpenseEntry,
      BaseReferences<_$AppDatabase, $ExpenseTableTable, ExpenseEntry>
    ),
    ExpenseEntry,
    PrefetchHooks Function()>;
typedef $$GpsLogTableTableCreateCompanionBuilder = GpsLogTableCompanion
    Function({
  Value<int> id,
  required String eventName,
  required double latitude,
  required double longitude,
  required double accuracy,
  required DateTime timestamp,
  required String deviceId,
  Value<int> syncStatus,
  Value<DateTime> createdAt,
});
typedef $$GpsLogTableTableUpdateCompanionBuilder = GpsLogTableCompanion
    Function({
  Value<int> id,
  Value<String> eventName,
  Value<double> latitude,
  Value<double> longitude,
  Value<double> accuracy,
  Value<DateTime> timestamp,
  Value<String> deviceId,
  Value<int> syncStatus,
  Value<DateTime> createdAt,
});

class $$GpsLogTableTableFilterComposer
    extends Composer<_$AppDatabase, $GpsLogTableTable> {
  $$GpsLogTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get eventName => $composableBuilder(
      column: $table.eventName, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get accuracy => $composableBuilder(
      column: $table.accuracy, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get timestamp => $composableBuilder(
      column: $table.timestamp, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get deviceId => $composableBuilder(
      column: $table.deviceId, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));
}

class $$GpsLogTableTableOrderingComposer
    extends Composer<_$AppDatabase, $GpsLogTableTable> {
  $$GpsLogTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get eventName => $composableBuilder(
      column: $table.eventName, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get accuracy => $composableBuilder(
      column: $table.accuracy, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get timestamp => $composableBuilder(
      column: $table.timestamp, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get deviceId => $composableBuilder(
      column: $table.deviceId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));
}

class $$GpsLogTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $GpsLogTableTable> {
  $$GpsLogTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get eventName =>
      $composableBuilder(column: $table.eventName, builder: (column) => column);

  GeneratedColumn<double> get latitude =>
      $composableBuilder(column: $table.latitude, builder: (column) => column);

  GeneratedColumn<double> get longitude =>
      $composableBuilder(column: $table.longitude, builder: (column) => column);

  GeneratedColumn<double> get accuracy =>
      $composableBuilder(column: $table.accuracy, builder: (column) => column);

  GeneratedColumn<DateTime> get timestamp =>
      $composableBuilder(column: $table.timestamp, builder: (column) => column);

  GeneratedColumn<String> get deviceId =>
      $composableBuilder(column: $table.deviceId, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);
}

class $$GpsLogTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $GpsLogTableTable,
    GpsLogEntry,
    $$GpsLogTableTableFilterComposer,
    $$GpsLogTableTableOrderingComposer,
    $$GpsLogTableTableAnnotationComposer,
    $$GpsLogTableTableCreateCompanionBuilder,
    $$GpsLogTableTableUpdateCompanionBuilder,
    (
      GpsLogEntry,
      BaseReferences<_$AppDatabase, $GpsLogTableTable, GpsLogEntry>
    ),
    GpsLogEntry,
    PrefetchHooks Function()> {
  $$GpsLogTableTableTableManager(_$AppDatabase db, $GpsLogTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$GpsLogTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$GpsLogTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$GpsLogTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> eventName = const Value.absent(),
            Value<double> latitude = const Value.absent(),
            Value<double> longitude = const Value.absent(),
            Value<double> accuracy = const Value.absent(),
            Value<DateTime> timestamp = const Value.absent(),
            Value<String> deviceId = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              GpsLogTableCompanion(
            id: id,
            eventName: eventName,
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy,
            timestamp: timestamp,
            deviceId: deviceId,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String eventName,
            required double latitude,
            required double longitude,
            required double accuracy,
            required DateTime timestamp,
            required String deviceId,
            Value<int> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              GpsLogTableCompanion.insert(
            id: id,
            eventName: eventName,
            latitude: latitude,
            longitude: longitude,
            accuracy: accuracy,
            timestamp: timestamp,
            deviceId: deviceId,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$GpsLogTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $GpsLogTableTable,
    GpsLogEntry,
    $$GpsLogTableTableFilterComposer,
    $$GpsLogTableTableOrderingComposer,
    $$GpsLogTableTableAnnotationComposer,
    $$GpsLogTableTableCreateCompanionBuilder,
    $$GpsLogTableTableUpdateCompanionBuilder,
    (
      GpsLogEntry,
      BaseReferences<_$AppDatabase, $GpsLogTableTable, GpsLogEntry>
    ),
    GpsLogEntry,
    PrefetchHooks Function()>;
typedef $$HolidayTableTableCreateCompanionBuilder = HolidayTableCompanion
    Function({
  Value<int> id,
  required DateTime date,
  required String name,
  required String type,
  Value<String?> regionId,
});
typedef $$HolidayTableTableUpdateCompanionBuilder = HolidayTableCompanion
    Function({
  Value<int> id,
  Value<DateTime> date,
  Value<String> name,
  Value<String> type,
  Value<String?> regionId,
});

class $$HolidayTableTableFilterComposer
    extends Composer<_$AppDatabase, $HolidayTableTable> {
  $$HolidayTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get type => $composableBuilder(
      column: $table.type, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get regionId => $composableBuilder(
      column: $table.regionId, builder: (column) => ColumnFilters(column));
}

class $$HolidayTableTableOrderingComposer
    extends Composer<_$AppDatabase, $HolidayTableTable> {
  $$HolidayTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get type => $composableBuilder(
      column: $table.type, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get regionId => $composableBuilder(
      column: $table.regionId, builder: (column) => ColumnOrderings(column));
}

class $$HolidayTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $HolidayTableTable> {
  $$HolidayTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<DateTime> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get type =>
      $composableBuilder(column: $table.type, builder: (column) => column);

  GeneratedColumn<String> get regionId =>
      $composableBuilder(column: $table.regionId, builder: (column) => column);
}

class $$HolidayTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $HolidayTableTable,
    HolidayEntry,
    $$HolidayTableTableFilterComposer,
    $$HolidayTableTableOrderingComposer,
    $$HolidayTableTableAnnotationComposer,
    $$HolidayTableTableCreateCompanionBuilder,
    $$HolidayTableTableUpdateCompanionBuilder,
    (
      HolidayEntry,
      BaseReferences<_$AppDatabase, $HolidayTableTable, HolidayEntry>
    ),
    HolidayEntry,
    PrefetchHooks Function()> {
  $$HolidayTableTableTableManager(_$AppDatabase db, $HolidayTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$HolidayTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$HolidayTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$HolidayTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<DateTime> date = const Value.absent(),
            Value<String> name = const Value.absent(),
            Value<String> type = const Value.absent(),
            Value<String?> regionId = const Value.absent(),
          }) =>
              HolidayTableCompanion(
            id: id,
            date: date,
            name: name,
            type: type,
            regionId: regionId,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required DateTime date,
            required String name,
            required String type,
            Value<String?> regionId = const Value.absent(),
          }) =>
              HolidayTableCompanion.insert(
            id: id,
            date: date,
            name: name,
            type: type,
            regionId: regionId,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$HolidayTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $HolidayTableTable,
    HolidayEntry,
    $$HolidayTableTableFilterComposer,
    $$HolidayTableTableOrderingComposer,
    $$HolidayTableTableAnnotationComposer,
    $$HolidayTableTableCreateCompanionBuilder,
    $$HolidayTableTableUpdateCompanionBuilder,
    (
      HolidayEntry,
      BaseReferences<_$AppDatabase, $HolidayTableTable, HolidayEntry>
    ),
    HolidayEntry,
    PrefetchHooks Function()>;
typedef $$JointWorkTableTableCreateCompanionBuilder = JointWorkTableCompanion
    Function({
  Value<int> id,
  required DateTime date,
  required String managerId,
  required String managerName,
  Value<int> syncStatus,
});
typedef $$JointWorkTableTableUpdateCompanionBuilder = JointWorkTableCompanion
    Function({
  Value<int> id,
  Value<DateTime> date,
  Value<String> managerId,
  Value<String> managerName,
  Value<int> syncStatus,
});

class $$JointWorkTableTableFilterComposer
    extends Composer<_$AppDatabase, $JointWorkTableTable> {
  $$JointWorkTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get managerId => $composableBuilder(
      column: $table.managerId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get managerName => $composableBuilder(
      column: $table.managerName, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$JointWorkTableTableOrderingComposer
    extends Composer<_$AppDatabase, $JointWorkTableTable> {
  $$JointWorkTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get managerId => $composableBuilder(
      column: $table.managerId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get managerName => $composableBuilder(
      column: $table.managerName, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$JointWorkTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $JointWorkTableTable> {
  $$JointWorkTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<DateTime> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<String> get managerId =>
      $composableBuilder(column: $table.managerId, builder: (column) => column);

  GeneratedColumn<String> get managerName => $composableBuilder(
      column: $table.managerName, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$JointWorkTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $JointWorkTableTable,
    JointWorkEntry,
    $$JointWorkTableTableFilterComposer,
    $$JointWorkTableTableOrderingComposer,
    $$JointWorkTableTableAnnotationComposer,
    $$JointWorkTableTableCreateCompanionBuilder,
    $$JointWorkTableTableUpdateCompanionBuilder,
    (
      JointWorkEntry,
      BaseReferences<_$AppDatabase, $JointWorkTableTable, JointWorkEntry>
    ),
    JointWorkEntry,
    PrefetchHooks Function()> {
  $$JointWorkTableTableTableManager(
      _$AppDatabase db, $JointWorkTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$JointWorkTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$JointWorkTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$JointWorkTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<DateTime> date = const Value.absent(),
            Value<String> managerId = const Value.absent(),
            Value<String> managerName = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
          }) =>
              JointWorkTableCompanion(
            id: id,
            date: date,
            managerId: managerId,
            managerName: managerName,
            syncStatus: syncStatus,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required DateTime date,
            required String managerId,
            required String managerName,
            Value<int> syncStatus = const Value.absent(),
          }) =>
              JointWorkTableCompanion.insert(
            id: id,
            date: date,
            managerId: managerId,
            managerName: managerName,
            syncStatus: syncStatus,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$JointWorkTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $JointWorkTableTable,
    JointWorkEntry,
    $$JointWorkTableTableFilterComposer,
    $$JointWorkTableTableOrderingComposer,
    $$JointWorkTableTableAnnotationComposer,
    $$JointWorkTableTableCreateCompanionBuilder,
    $$JointWorkTableTableUpdateCompanionBuilder,
    (
      JointWorkEntry,
      BaseReferences<_$AppDatabase, $JointWorkTableTable, JointWorkEntry>
    ),
    JointWorkEntry,
    PrefetchHooks Function()>;
typedef $$MiscExpenseTableTableCreateCompanionBuilder
    = MiscExpenseTableCompanion Function({
  required String id,
  required String expenseId,
  required String category,
  Value<double> amount,
  Value<String?> remarks,
  Value<int> rowid,
});
typedef $$MiscExpenseTableTableUpdateCompanionBuilder
    = MiscExpenseTableCompanion Function({
  Value<String> id,
  Value<String> expenseId,
  Value<String> category,
  Value<double> amount,
  Value<String?> remarks,
  Value<int> rowid,
});

class $$MiscExpenseTableTableFilterComposer
    extends Composer<_$AppDatabase, $MiscExpenseTableTable> {
  $$MiscExpenseTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get expenseId => $composableBuilder(
      column: $table.expenseId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get category => $composableBuilder(
      column: $table.category, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get amount => $composableBuilder(
      column: $table.amount, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get remarks => $composableBuilder(
      column: $table.remarks, builder: (column) => ColumnFilters(column));
}

class $$MiscExpenseTableTableOrderingComposer
    extends Composer<_$AppDatabase, $MiscExpenseTableTable> {
  $$MiscExpenseTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get expenseId => $composableBuilder(
      column: $table.expenseId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get category => $composableBuilder(
      column: $table.category, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get amount => $composableBuilder(
      column: $table.amount, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get remarks => $composableBuilder(
      column: $table.remarks, builder: (column) => ColumnOrderings(column));
}

class $$MiscExpenseTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $MiscExpenseTableTable> {
  $$MiscExpenseTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get expenseId =>
      $composableBuilder(column: $table.expenseId, builder: (column) => column);

  GeneratedColumn<String> get category =>
      $composableBuilder(column: $table.category, builder: (column) => column);

  GeneratedColumn<double> get amount =>
      $composableBuilder(column: $table.amount, builder: (column) => column);

  GeneratedColumn<String> get remarks =>
      $composableBuilder(column: $table.remarks, builder: (column) => column);
}

class $$MiscExpenseTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $MiscExpenseTableTable,
    MiscExpenseEntry,
    $$MiscExpenseTableTableFilterComposer,
    $$MiscExpenseTableTableOrderingComposer,
    $$MiscExpenseTableTableAnnotationComposer,
    $$MiscExpenseTableTableCreateCompanionBuilder,
    $$MiscExpenseTableTableUpdateCompanionBuilder,
    (
      MiscExpenseEntry,
      BaseReferences<_$AppDatabase, $MiscExpenseTableTable, MiscExpenseEntry>
    ),
    MiscExpenseEntry,
    PrefetchHooks Function()> {
  $$MiscExpenseTableTableTableManager(
      _$AppDatabase db, $MiscExpenseTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MiscExpenseTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MiscExpenseTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MiscExpenseTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> expenseId = const Value.absent(),
            Value<String> category = const Value.absent(),
            Value<double> amount = const Value.absent(),
            Value<String?> remarks = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              MiscExpenseTableCompanion(
            id: id,
            expenseId: expenseId,
            category: category,
            amount: amount,
            remarks: remarks,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String expenseId,
            required String category,
            Value<double> amount = const Value.absent(),
            Value<String?> remarks = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              MiscExpenseTableCompanion.insert(
            id: id,
            expenseId: expenseId,
            category: category,
            amount: amount,
            remarks: remarks,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$MiscExpenseTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $MiscExpenseTableTable,
    MiscExpenseEntry,
    $$MiscExpenseTableTableFilterComposer,
    $$MiscExpenseTableTableOrderingComposer,
    $$MiscExpenseTableTableAnnotationComposer,
    $$MiscExpenseTableTableCreateCompanionBuilder,
    $$MiscExpenseTableTableUpdateCompanionBuilder,
    (
      MiscExpenseEntry,
      BaseReferences<_$AppDatabase, $MiscExpenseTableTable, MiscExpenseEntry>
    ),
    MiscExpenseEntry,
    PrefetchHooks Function()>;
typedef $$MtpAuditTableTableCreateCompanionBuilder = MtpAuditTableCompanion
    Function({
  Value<int> id,
  required String mtpId,
  required String actionBy,
  required String actionByName,
  required String previousStatus,
  required String newStatus,
  Value<String?> remarks,
  Value<DateTime> actionDate,
  Value<int> syncStatus,
});
typedef $$MtpAuditTableTableUpdateCompanionBuilder = MtpAuditTableCompanion
    Function({
  Value<int> id,
  Value<String> mtpId,
  Value<String> actionBy,
  Value<String> actionByName,
  Value<String> previousStatus,
  Value<String> newStatus,
  Value<String?> remarks,
  Value<DateTime> actionDate,
  Value<int> syncStatus,
});

class $$MtpAuditTableTableFilterComposer
    extends Composer<_$AppDatabase, $MtpAuditTableTable> {
  $$MtpAuditTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get mtpId => $composableBuilder(
      column: $table.mtpId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get actionBy => $composableBuilder(
      column: $table.actionBy, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get actionByName => $composableBuilder(
      column: $table.actionByName, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get previousStatus => $composableBuilder(
      column: $table.previousStatus,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get newStatus => $composableBuilder(
      column: $table.newStatus, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get remarks => $composableBuilder(
      column: $table.remarks, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get actionDate => $composableBuilder(
      column: $table.actionDate, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$MtpAuditTableTableOrderingComposer
    extends Composer<_$AppDatabase, $MtpAuditTableTable> {
  $$MtpAuditTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get mtpId => $composableBuilder(
      column: $table.mtpId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get actionBy => $composableBuilder(
      column: $table.actionBy, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get actionByName => $composableBuilder(
      column: $table.actionByName,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get previousStatus => $composableBuilder(
      column: $table.previousStatus,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get newStatus => $composableBuilder(
      column: $table.newStatus, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get remarks => $composableBuilder(
      column: $table.remarks, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get actionDate => $composableBuilder(
      column: $table.actionDate, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$MtpAuditTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $MtpAuditTableTable> {
  $$MtpAuditTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get mtpId =>
      $composableBuilder(column: $table.mtpId, builder: (column) => column);

  GeneratedColumn<String> get actionBy =>
      $composableBuilder(column: $table.actionBy, builder: (column) => column);

  GeneratedColumn<String> get actionByName => $composableBuilder(
      column: $table.actionByName, builder: (column) => column);

  GeneratedColumn<String> get previousStatus => $composableBuilder(
      column: $table.previousStatus, builder: (column) => column);

  GeneratedColumn<String> get newStatus =>
      $composableBuilder(column: $table.newStatus, builder: (column) => column);

  GeneratedColumn<String> get remarks =>
      $composableBuilder(column: $table.remarks, builder: (column) => column);

  GeneratedColumn<DateTime> get actionDate => $composableBuilder(
      column: $table.actionDate, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$MtpAuditTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $MtpAuditTableTable,
    MtpAuditEntry,
    $$MtpAuditTableTableFilterComposer,
    $$MtpAuditTableTableOrderingComposer,
    $$MtpAuditTableTableAnnotationComposer,
    $$MtpAuditTableTableCreateCompanionBuilder,
    $$MtpAuditTableTableUpdateCompanionBuilder,
    (
      MtpAuditEntry,
      BaseReferences<_$AppDatabase, $MtpAuditTableTable, MtpAuditEntry>
    ),
    MtpAuditEntry,
    PrefetchHooks Function()> {
  $$MtpAuditTableTableTableManager(_$AppDatabase db, $MtpAuditTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MtpAuditTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MtpAuditTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MtpAuditTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> mtpId = const Value.absent(),
            Value<String> actionBy = const Value.absent(),
            Value<String> actionByName = const Value.absent(),
            Value<String> previousStatus = const Value.absent(),
            Value<String> newStatus = const Value.absent(),
            Value<String?> remarks = const Value.absent(),
            Value<DateTime> actionDate = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
          }) =>
              MtpAuditTableCompanion(
            id: id,
            mtpId: mtpId,
            actionBy: actionBy,
            actionByName: actionByName,
            previousStatus: previousStatus,
            newStatus: newStatus,
            remarks: remarks,
            actionDate: actionDate,
            syncStatus: syncStatus,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String mtpId,
            required String actionBy,
            required String actionByName,
            required String previousStatus,
            required String newStatus,
            Value<String?> remarks = const Value.absent(),
            Value<DateTime> actionDate = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
          }) =>
              MtpAuditTableCompanion.insert(
            id: id,
            mtpId: mtpId,
            actionBy: actionBy,
            actionByName: actionByName,
            previousStatus: previousStatus,
            newStatus: newStatus,
            remarks: remarks,
            actionDate: actionDate,
            syncStatus: syncStatus,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$MtpAuditTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $MtpAuditTableTable,
    MtpAuditEntry,
    $$MtpAuditTableTableFilterComposer,
    $$MtpAuditTableTableOrderingComposer,
    $$MtpAuditTableTableAnnotationComposer,
    $$MtpAuditTableTableCreateCompanionBuilder,
    $$MtpAuditTableTableUpdateCompanionBuilder,
    (
      MtpAuditEntry,
      BaseReferences<_$AppDatabase, $MtpAuditTableTable, MtpAuditEntry>
    ),
    MtpAuditEntry,
    PrefetchHooks Function()>;
typedef $$MtpSettingsTableTableCreateCompanionBuilder
    = MtpSettingsTableCompanion Function({
  required String id,
  Value<int> submissionDeadlineDay,
  Value<int> provisionalApprovalEndDay,
  Value<int> rowid,
});
typedef $$MtpSettingsTableTableUpdateCompanionBuilder
    = MtpSettingsTableCompanion Function({
  Value<String> id,
  Value<int> submissionDeadlineDay,
  Value<int> provisionalApprovalEndDay,
  Value<int> rowid,
});

class $$MtpSettingsTableTableFilterComposer
    extends Composer<_$AppDatabase, $MtpSettingsTableTable> {
  $$MtpSettingsTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get submissionDeadlineDay => $composableBuilder(
      column: $table.submissionDeadlineDay,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get provisionalApprovalEndDay => $composableBuilder(
      column: $table.provisionalApprovalEndDay,
      builder: (column) => ColumnFilters(column));
}

class $$MtpSettingsTableTableOrderingComposer
    extends Composer<_$AppDatabase, $MtpSettingsTableTable> {
  $$MtpSettingsTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get submissionDeadlineDay => $composableBuilder(
      column: $table.submissionDeadlineDay,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get provisionalApprovalEndDay => $composableBuilder(
      column: $table.provisionalApprovalEndDay,
      builder: (column) => ColumnOrderings(column));
}

class $$MtpSettingsTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $MtpSettingsTableTable> {
  $$MtpSettingsTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<int> get submissionDeadlineDay => $composableBuilder(
      column: $table.submissionDeadlineDay, builder: (column) => column);

  GeneratedColumn<int> get provisionalApprovalEndDay => $composableBuilder(
      column: $table.provisionalApprovalEndDay, builder: (column) => column);
}

class $$MtpSettingsTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $MtpSettingsTableTable,
    MtpSettingsEntry,
    $$MtpSettingsTableTableFilterComposer,
    $$MtpSettingsTableTableOrderingComposer,
    $$MtpSettingsTableTableAnnotationComposer,
    $$MtpSettingsTableTableCreateCompanionBuilder,
    $$MtpSettingsTableTableUpdateCompanionBuilder,
    (
      MtpSettingsEntry,
      BaseReferences<_$AppDatabase, $MtpSettingsTableTable, MtpSettingsEntry>
    ),
    MtpSettingsEntry,
    PrefetchHooks Function()> {
  $$MtpSettingsTableTableTableManager(
      _$AppDatabase db, $MtpSettingsTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MtpSettingsTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MtpSettingsTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MtpSettingsTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<int> submissionDeadlineDay = const Value.absent(),
            Value<int> provisionalApprovalEndDay = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              MtpSettingsTableCompanion(
            id: id,
            submissionDeadlineDay: submissionDeadlineDay,
            provisionalApprovalEndDay: provisionalApprovalEndDay,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            Value<int> submissionDeadlineDay = const Value.absent(),
            Value<int> provisionalApprovalEndDay = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              MtpSettingsTableCompanion.insert(
            id: id,
            submissionDeadlineDay: submissionDeadlineDay,
            provisionalApprovalEndDay: provisionalApprovalEndDay,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$MtpSettingsTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $MtpSettingsTableTable,
    MtpSettingsEntry,
    $$MtpSettingsTableTableFilterComposer,
    $$MtpSettingsTableTableOrderingComposer,
    $$MtpSettingsTableTableAnnotationComposer,
    $$MtpSettingsTableTableCreateCompanionBuilder,
    $$MtpSettingsTableTableUpdateCompanionBuilder,
    (
      MtpSettingsEntry,
      BaseReferences<_$AppDatabase, $MtpSettingsTableTable, MtpSettingsEntry>
    ),
    MtpSettingsEntry,
    PrefetchHooks Function()>;
typedef $$MtpTableTableCreateCompanionBuilder = MtpTableCompanion Function({
  Value<int> id,
  required String employeeId,
  required int month,
  required int year,
  Value<String> status,
  Value<int> syncStatus,
  Value<DateTime> createdAt,
});
typedef $$MtpTableTableUpdateCompanionBuilder = MtpTableCompanion Function({
  Value<int> id,
  Value<String> employeeId,
  Value<int> month,
  Value<int> year,
  Value<String> status,
  Value<int> syncStatus,
  Value<DateTime> createdAt,
});

final class $$MtpTableTableReferences
    extends BaseReferences<_$AppDatabase, $MtpTableTable, MtpEntry> {
  $$MtpTableTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static MultiTypedResultKey<$MtpDayTableTable, List<MtpDayEntry>>
      _mtpDayTableRefsTable(_$AppDatabase db) =>
          MultiTypedResultKey.fromTable(db.mtpDayTable,
              aliasName:
                  $_aliasNameGenerator(db.mtpTable.id, db.mtpDayTable.mtpId));

  $$MtpDayTableTableProcessedTableManager get mtpDayTableRefs {
    final manager = $$MtpDayTableTableTableManager($_db, $_db.mtpDayTable)
        .filter((f) => f.mtpId.id.sqlEquals($_itemColumn<int>('id')!));

    final cache = $_typedResult.readTableOrNull(_mtpDayTableRefsTable($_db));
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: cache));
  }
}

class $$MtpTableTableFilterComposer
    extends Composer<_$AppDatabase, $MtpTableTable> {
  $$MtpTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get month => $composableBuilder(
      column: $table.month, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get year => $composableBuilder(
      column: $table.year, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));

  Expression<bool> mtpDayTableRefs(
      Expression<bool> Function($$MtpDayTableTableFilterComposer f) f) {
    final $$MtpDayTableTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.id,
        referencedTable: $db.mtpDayTable,
        getReferencedColumn: (t) => t.mtpId,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$MtpDayTableTableFilterComposer(
              $db: $db,
              $table: $db.mtpDayTable,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return f(composer);
  }
}

class $$MtpTableTableOrderingComposer
    extends Composer<_$AppDatabase, $MtpTableTable> {
  $$MtpTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get month => $composableBuilder(
      column: $table.month, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get year => $composableBuilder(
      column: $table.year, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));
}

class $$MtpTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $MtpTableTable> {
  $$MtpTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => column);

  GeneratedColumn<int> get month =>
      $composableBuilder(column: $table.month, builder: (column) => column);

  GeneratedColumn<int> get year =>
      $composableBuilder(column: $table.year, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  Expression<T> mtpDayTableRefs<T extends Object>(
      Expression<T> Function($$MtpDayTableTableAnnotationComposer a) f) {
    final $$MtpDayTableTableAnnotationComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.id,
        referencedTable: $db.mtpDayTable,
        getReferencedColumn: (t) => t.mtpId,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$MtpDayTableTableAnnotationComposer(
              $db: $db,
              $table: $db.mtpDayTable,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return f(composer);
  }
}

class $$MtpTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $MtpTableTable,
    MtpEntry,
    $$MtpTableTableFilterComposer,
    $$MtpTableTableOrderingComposer,
    $$MtpTableTableAnnotationComposer,
    $$MtpTableTableCreateCompanionBuilder,
    $$MtpTableTableUpdateCompanionBuilder,
    (MtpEntry, $$MtpTableTableReferences),
    MtpEntry,
    PrefetchHooks Function({bool mtpDayTableRefs})> {
  $$MtpTableTableTableManager(_$AppDatabase db, $MtpTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MtpTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MtpTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MtpTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> employeeId = const Value.absent(),
            Value<int> month = const Value.absent(),
            Value<int> year = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              MtpTableCompanion(
            id: id,
            employeeId: employeeId,
            month: month,
            year: year,
            status: status,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String employeeId,
            required int month,
            required int year,
            Value<String> status = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              MtpTableCompanion.insert(
            id: id,
            employeeId: employeeId,
            month: month,
            year: year,
            status: status,
            syncStatus: syncStatus,
            createdAt: createdAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) =>
                  (e.readTable(table), $$MtpTableTableReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: ({mtpDayTableRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [if (mtpDayTableRefs) db.mtpDayTable],
              addJoins: null,
              getPrefetchedDataCallback: (items) async {
                return [
                  if (mtpDayTableRefs)
                    await $_getPrefetchedData<MtpEntry, $MtpTableTable,
                            MtpDayEntry>(
                        currentTable: table,
                        referencedTable:
                            $$MtpTableTableReferences._mtpDayTableRefsTable(db),
                        managerFromTypedResult: (p0) =>
                            $$MtpTableTableReferences(db, table, p0)
                                .mtpDayTableRefs,
                        referencedItemsForCurrentItem: (item,
                                referencedItems) =>
                            referencedItems.where((e) => e.mtpId == item.id),
                        typedResults: items)
                ];
              },
            );
          },
        ));
}

typedef $$MtpTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $MtpTableTable,
    MtpEntry,
    $$MtpTableTableFilterComposer,
    $$MtpTableTableOrderingComposer,
    $$MtpTableTableAnnotationComposer,
    $$MtpTableTableCreateCompanionBuilder,
    $$MtpTableTableUpdateCompanionBuilder,
    (MtpEntry, $$MtpTableTableReferences),
    MtpEntry,
    PrefetchHooks Function({bool mtpDayTableRefs})>;
typedef $$MtpDayTableTableCreateCompanionBuilder = MtpDayTableCompanion
    Function({
  Value<int> id,
  required int mtpId,
  required DateTime date,
  required String workType,
  required String locationType,
  Value<String?> notes,
});
typedef $$MtpDayTableTableUpdateCompanionBuilder = MtpDayTableCompanion
    Function({
  Value<int> id,
  Value<int> mtpId,
  Value<DateTime> date,
  Value<String> workType,
  Value<String> locationType,
  Value<String?> notes,
});

final class $$MtpDayTableTableReferences
    extends BaseReferences<_$AppDatabase, $MtpDayTableTable, MtpDayEntry> {
  $$MtpDayTableTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static $MtpTableTable _mtpIdTable(_$AppDatabase db) => db.mtpTable
      .createAlias($_aliasNameGenerator(db.mtpDayTable.mtpId, db.mtpTable.id));

  $$MtpTableTableProcessedTableManager get mtpId {
    final $_column = $_itemColumn<int>('mtp_id')!;

    final manager = $$MtpTableTableTableManager($_db, $_db.mtpTable)
        .filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_mtpIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: [item]));
  }

  static MultiTypedResultKey<$MtpDoctorTableTable, List<MtpDoctorEntry>>
      _mtpDoctorTableRefsTable(_$AppDatabase db) =>
          MultiTypedResultKey.fromTable(db.mtpDoctorTable,
              aliasName: $_aliasNameGenerator(
                  db.mtpDayTable.id, db.mtpDoctorTable.mtpDayId));

  $$MtpDoctorTableTableProcessedTableManager get mtpDoctorTableRefs {
    final manager = $$MtpDoctorTableTableTableManager($_db, $_db.mtpDoctorTable)
        .filter((f) => f.mtpDayId.id.sqlEquals($_itemColumn<int>('id')!));

    final cache = $_typedResult.readTableOrNull(_mtpDoctorTableRefsTable($_db));
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: cache));
  }
}

class $$MtpDayTableTableFilterComposer
    extends Composer<_$AppDatabase, $MtpDayTableTable> {
  $$MtpDayTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get workType => $composableBuilder(
      column: $table.workType, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get locationType => $composableBuilder(
      column: $table.locationType, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get notes => $composableBuilder(
      column: $table.notes, builder: (column) => ColumnFilters(column));

  $$MtpTableTableFilterComposer get mtpId {
    final $$MtpTableTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.mtpId,
        referencedTable: $db.mtpTable,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$MtpTableTableFilterComposer(
              $db: $db,
              $table: $db.mtpTable,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }

  Expression<bool> mtpDoctorTableRefs(
      Expression<bool> Function($$MtpDoctorTableTableFilterComposer f) f) {
    final $$MtpDoctorTableTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.id,
        referencedTable: $db.mtpDoctorTable,
        getReferencedColumn: (t) => t.mtpDayId,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$MtpDoctorTableTableFilterComposer(
              $db: $db,
              $table: $db.mtpDoctorTable,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return f(composer);
  }
}

class $$MtpDayTableTableOrderingComposer
    extends Composer<_$AppDatabase, $MtpDayTableTable> {
  $$MtpDayTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get workType => $composableBuilder(
      column: $table.workType, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get locationType => $composableBuilder(
      column: $table.locationType,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get notes => $composableBuilder(
      column: $table.notes, builder: (column) => ColumnOrderings(column));

  $$MtpTableTableOrderingComposer get mtpId {
    final $$MtpTableTableOrderingComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.mtpId,
        referencedTable: $db.mtpTable,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$MtpTableTableOrderingComposer(
              $db: $db,
              $table: $db.mtpTable,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$MtpDayTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $MtpDayTableTable> {
  $$MtpDayTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<DateTime> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<String> get workType =>
      $composableBuilder(column: $table.workType, builder: (column) => column);

  GeneratedColumn<String> get locationType => $composableBuilder(
      column: $table.locationType, builder: (column) => column);

  GeneratedColumn<String> get notes =>
      $composableBuilder(column: $table.notes, builder: (column) => column);

  $$MtpTableTableAnnotationComposer get mtpId {
    final $$MtpTableTableAnnotationComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.mtpId,
        referencedTable: $db.mtpTable,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$MtpTableTableAnnotationComposer(
              $db: $db,
              $table: $db.mtpTable,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }

  Expression<T> mtpDoctorTableRefs<T extends Object>(
      Expression<T> Function($$MtpDoctorTableTableAnnotationComposer a) f) {
    final $$MtpDoctorTableTableAnnotationComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.id,
        referencedTable: $db.mtpDoctorTable,
        getReferencedColumn: (t) => t.mtpDayId,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$MtpDoctorTableTableAnnotationComposer(
              $db: $db,
              $table: $db.mtpDoctorTable,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return f(composer);
  }
}

class $$MtpDayTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $MtpDayTableTable,
    MtpDayEntry,
    $$MtpDayTableTableFilterComposer,
    $$MtpDayTableTableOrderingComposer,
    $$MtpDayTableTableAnnotationComposer,
    $$MtpDayTableTableCreateCompanionBuilder,
    $$MtpDayTableTableUpdateCompanionBuilder,
    (MtpDayEntry, $$MtpDayTableTableReferences),
    MtpDayEntry,
    PrefetchHooks Function({bool mtpId, bool mtpDoctorTableRefs})> {
  $$MtpDayTableTableTableManager(_$AppDatabase db, $MtpDayTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MtpDayTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MtpDayTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MtpDayTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<int> mtpId = const Value.absent(),
            Value<DateTime> date = const Value.absent(),
            Value<String> workType = const Value.absent(),
            Value<String> locationType = const Value.absent(),
            Value<String?> notes = const Value.absent(),
          }) =>
              MtpDayTableCompanion(
            id: id,
            mtpId: mtpId,
            date: date,
            workType: workType,
            locationType: locationType,
            notes: notes,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required int mtpId,
            required DateTime date,
            required String workType,
            required String locationType,
            Value<String?> notes = const Value.absent(),
          }) =>
              MtpDayTableCompanion.insert(
            id: id,
            mtpId: mtpId,
            date: date,
            workType: workType,
            locationType: locationType,
            notes: notes,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (
                    e.readTable(table),
                    $$MtpDayTableTableReferences(db, table, e)
                  ))
              .toList(),
          prefetchHooksCallback: ({mtpId = false, mtpDoctorTableRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [
                if (mtpDoctorTableRefs) db.mtpDoctorTable
              ],
              addJoins: <
                  T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic>>(state) {
                if (mtpId) {
                  state = state.withJoin(
                    currentTable: table,
                    currentColumn: table.mtpId,
                    referencedTable:
                        $$MtpDayTableTableReferences._mtpIdTable(db),
                    referencedColumn:
                        $$MtpDayTableTableReferences._mtpIdTable(db).id,
                  ) as T;
                }

                return state;
              },
              getPrefetchedDataCallback: (items) async {
                return [
                  if (mtpDoctorTableRefs)
                    await $_getPrefetchedData<MtpDayEntry, $MtpDayTableTable,
                            MtpDoctorEntry>(
                        currentTable: table,
                        referencedTable: $$MtpDayTableTableReferences
                            ._mtpDoctorTableRefsTable(db),
                        managerFromTypedResult: (p0) =>
                            $$MtpDayTableTableReferences(db, table, p0)
                                .mtpDoctorTableRefs,
                        referencedItemsForCurrentItem: (item,
                                referencedItems) =>
                            referencedItems.where((e) => e.mtpDayId == item.id),
                        typedResults: items)
                ];
              },
            );
          },
        ));
}

typedef $$MtpDayTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $MtpDayTableTable,
    MtpDayEntry,
    $$MtpDayTableTableFilterComposer,
    $$MtpDayTableTableOrderingComposer,
    $$MtpDayTableTableAnnotationComposer,
    $$MtpDayTableTableCreateCompanionBuilder,
    $$MtpDayTableTableUpdateCompanionBuilder,
    (MtpDayEntry, $$MtpDayTableTableReferences),
    MtpDayEntry,
    PrefetchHooks Function({bool mtpId, bool mtpDoctorTableRefs})>;
typedef $$MtpDoctorTableTableCreateCompanionBuilder = MtpDoctorTableCompanion
    Function({
  Value<int> id,
  required int mtpDayId,
  required String doctorId,
  required String doctorName,
  required String specialty,
});
typedef $$MtpDoctorTableTableUpdateCompanionBuilder = MtpDoctorTableCompanion
    Function({
  Value<int> id,
  Value<int> mtpDayId,
  Value<String> doctorId,
  Value<String> doctorName,
  Value<String> specialty,
});

final class $$MtpDoctorTableTableReferences extends BaseReferences<
    _$AppDatabase, $MtpDoctorTableTable, MtpDoctorEntry> {
  $$MtpDoctorTableTableReferences(
      super.$_db, super.$_table, super.$_typedResult);

  static $MtpDayTableTable _mtpDayIdTable(_$AppDatabase db) =>
      db.mtpDayTable.createAlias(
          $_aliasNameGenerator(db.mtpDoctorTable.mtpDayId, db.mtpDayTable.id));

  $$MtpDayTableTableProcessedTableManager get mtpDayId {
    final $_column = $_itemColumn<int>('mtp_day_id')!;

    final manager = $$MtpDayTableTableTableManager($_db, $_db.mtpDayTable)
        .filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_mtpDayIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: [item]));
  }
}

class $$MtpDoctorTableTableFilterComposer
    extends Composer<_$AppDatabase, $MtpDoctorTableTable> {
  $$MtpDoctorTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get doctorId => $composableBuilder(
      column: $table.doctorId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get doctorName => $composableBuilder(
      column: $table.doctorName, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get specialty => $composableBuilder(
      column: $table.specialty, builder: (column) => ColumnFilters(column));

  $$MtpDayTableTableFilterComposer get mtpDayId {
    final $$MtpDayTableTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.mtpDayId,
        referencedTable: $db.mtpDayTable,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$MtpDayTableTableFilterComposer(
              $db: $db,
              $table: $db.mtpDayTable,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$MtpDoctorTableTableOrderingComposer
    extends Composer<_$AppDatabase, $MtpDoctorTableTable> {
  $$MtpDoctorTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get doctorId => $composableBuilder(
      column: $table.doctorId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get doctorName => $composableBuilder(
      column: $table.doctorName, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get specialty => $composableBuilder(
      column: $table.specialty, builder: (column) => ColumnOrderings(column));

  $$MtpDayTableTableOrderingComposer get mtpDayId {
    final $$MtpDayTableTableOrderingComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.mtpDayId,
        referencedTable: $db.mtpDayTable,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$MtpDayTableTableOrderingComposer(
              $db: $db,
              $table: $db.mtpDayTable,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$MtpDoctorTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $MtpDoctorTableTable> {
  $$MtpDoctorTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get doctorId =>
      $composableBuilder(column: $table.doctorId, builder: (column) => column);

  GeneratedColumn<String> get doctorName => $composableBuilder(
      column: $table.doctorName, builder: (column) => column);

  GeneratedColumn<String> get specialty =>
      $composableBuilder(column: $table.specialty, builder: (column) => column);

  $$MtpDayTableTableAnnotationComposer get mtpDayId {
    final $$MtpDayTableTableAnnotationComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.mtpDayId,
        referencedTable: $db.mtpDayTable,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$MtpDayTableTableAnnotationComposer(
              $db: $db,
              $table: $db.mtpDayTable,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$MtpDoctorTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $MtpDoctorTableTable,
    MtpDoctorEntry,
    $$MtpDoctorTableTableFilterComposer,
    $$MtpDoctorTableTableOrderingComposer,
    $$MtpDoctorTableTableAnnotationComposer,
    $$MtpDoctorTableTableCreateCompanionBuilder,
    $$MtpDoctorTableTableUpdateCompanionBuilder,
    (MtpDoctorEntry, $$MtpDoctorTableTableReferences),
    MtpDoctorEntry,
    PrefetchHooks Function({bool mtpDayId})> {
  $$MtpDoctorTableTableTableManager(
      _$AppDatabase db, $MtpDoctorTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MtpDoctorTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MtpDoctorTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MtpDoctorTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<int> mtpDayId = const Value.absent(),
            Value<String> doctorId = const Value.absent(),
            Value<String> doctorName = const Value.absent(),
            Value<String> specialty = const Value.absent(),
          }) =>
              MtpDoctorTableCompanion(
            id: id,
            mtpDayId: mtpDayId,
            doctorId: doctorId,
            doctorName: doctorName,
            specialty: specialty,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required int mtpDayId,
            required String doctorId,
            required String doctorName,
            required String specialty,
          }) =>
              MtpDoctorTableCompanion.insert(
            id: id,
            mtpDayId: mtpDayId,
            doctorId: doctorId,
            doctorName: doctorName,
            specialty: specialty,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (
                    e.readTable(table),
                    $$MtpDoctorTableTableReferences(db, table, e)
                  ))
              .toList(),
          prefetchHooksCallback: ({mtpDayId = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [],
              addJoins: <
                  T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic>>(state) {
                if (mtpDayId) {
                  state = state.withJoin(
                    currentTable: table,
                    currentColumn: table.mtpDayId,
                    referencedTable:
                        $$MtpDoctorTableTableReferences._mtpDayIdTable(db),
                    referencedColumn:
                        $$MtpDoctorTableTableReferences._mtpDayIdTable(db).id,
                  ) as T;
                }

                return state;
              },
              getPrefetchedDataCallback: (items) async {
                return [];
              },
            );
          },
        ));
}

typedef $$MtpDoctorTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $MtpDoctorTableTable,
    MtpDoctorEntry,
    $$MtpDoctorTableTableFilterComposer,
    $$MtpDoctorTableTableOrderingComposer,
    $$MtpDoctorTableTableAnnotationComposer,
    $$MtpDoctorTableTableCreateCompanionBuilder,
    $$MtpDoctorTableTableUpdateCompanionBuilder,
    (MtpDoctorEntry, $$MtpDoctorTableTableReferences),
    MtpDoctorEntry,
    PrefetchHooks Function({bool mtpDayId})>;
typedef $$OverrideRequestTableTableCreateCompanionBuilder
    = OverrideRequestTableCompanion Function({
  Value<int> id,
  required String employeeId,
  required String customerId,
  required String reason,
  Value<String?> note,
  Value<String?> photoPath,
  required double latitude,
  required double longitude,
  Value<DateTime> timestamp,
  Value<int> syncStatus,
});
typedef $$OverrideRequestTableTableUpdateCompanionBuilder
    = OverrideRequestTableCompanion Function({
  Value<int> id,
  Value<String> employeeId,
  Value<String> customerId,
  Value<String> reason,
  Value<String?> note,
  Value<String?> photoPath,
  Value<double> latitude,
  Value<double> longitude,
  Value<DateTime> timestamp,
  Value<int> syncStatus,
});

class $$OverrideRequestTableTableFilterComposer
    extends Composer<_$AppDatabase, $OverrideRequestTableTable> {
  $$OverrideRequestTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get reason => $composableBuilder(
      column: $table.reason, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get note => $composableBuilder(
      column: $table.note, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get photoPath => $composableBuilder(
      column: $table.photoPath, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get timestamp => $composableBuilder(
      column: $table.timestamp, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$OverrideRequestTableTableOrderingComposer
    extends Composer<_$AppDatabase, $OverrideRequestTableTable> {
  $$OverrideRequestTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get reason => $composableBuilder(
      column: $table.reason, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get note => $composableBuilder(
      column: $table.note, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get photoPath => $composableBuilder(
      column: $table.photoPath, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get timestamp => $composableBuilder(
      column: $table.timestamp, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$OverrideRequestTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $OverrideRequestTableTable> {
  $$OverrideRequestTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get employeeId => $composableBuilder(
      column: $table.employeeId, builder: (column) => column);

  GeneratedColumn<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => column);

  GeneratedColumn<String> get reason =>
      $composableBuilder(column: $table.reason, builder: (column) => column);

  GeneratedColumn<String> get note =>
      $composableBuilder(column: $table.note, builder: (column) => column);

  GeneratedColumn<String> get photoPath =>
      $composableBuilder(column: $table.photoPath, builder: (column) => column);

  GeneratedColumn<double> get latitude =>
      $composableBuilder(column: $table.latitude, builder: (column) => column);

  GeneratedColumn<double> get longitude =>
      $composableBuilder(column: $table.longitude, builder: (column) => column);

  GeneratedColumn<DateTime> get timestamp =>
      $composableBuilder(column: $table.timestamp, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$OverrideRequestTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $OverrideRequestTableTable,
    OverrideRequestEntry,
    $$OverrideRequestTableTableFilterComposer,
    $$OverrideRequestTableTableOrderingComposer,
    $$OverrideRequestTableTableAnnotationComposer,
    $$OverrideRequestTableTableCreateCompanionBuilder,
    $$OverrideRequestTableTableUpdateCompanionBuilder,
    (
      OverrideRequestEntry,
      BaseReferences<_$AppDatabase, $OverrideRequestTableTable,
          OverrideRequestEntry>
    ),
    OverrideRequestEntry,
    PrefetchHooks Function()> {
  $$OverrideRequestTableTableTableManager(
      _$AppDatabase db, $OverrideRequestTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$OverrideRequestTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$OverrideRequestTableTableOrderingComposer(
                  $db: db, $table: table),
          createComputedFieldComposer: () =>
              $$OverrideRequestTableTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> employeeId = const Value.absent(),
            Value<String> customerId = const Value.absent(),
            Value<String> reason = const Value.absent(),
            Value<String?> note = const Value.absent(),
            Value<String?> photoPath = const Value.absent(),
            Value<double> latitude = const Value.absent(),
            Value<double> longitude = const Value.absent(),
            Value<DateTime> timestamp = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
          }) =>
              OverrideRequestTableCompanion(
            id: id,
            employeeId: employeeId,
            customerId: customerId,
            reason: reason,
            note: note,
            photoPath: photoPath,
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp,
            syncStatus: syncStatus,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String employeeId,
            required String customerId,
            required String reason,
            Value<String?> note = const Value.absent(),
            Value<String?> photoPath = const Value.absent(),
            required double latitude,
            required double longitude,
            Value<DateTime> timestamp = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
          }) =>
              OverrideRequestTableCompanion.insert(
            id: id,
            employeeId: employeeId,
            customerId: customerId,
            reason: reason,
            note: note,
            photoPath: photoPath,
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp,
            syncStatus: syncStatus,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$OverrideRequestTableTableProcessedTableManager
    = ProcessedTableManager<
        _$AppDatabase,
        $OverrideRequestTableTable,
        OverrideRequestEntry,
        $$OverrideRequestTableTableFilterComposer,
        $$OverrideRequestTableTableOrderingComposer,
        $$OverrideRequestTableTableAnnotationComposer,
        $$OverrideRequestTableTableCreateCompanionBuilder,
        $$OverrideRequestTableTableUpdateCompanionBuilder,
        (
          OverrideRequestEntry,
          BaseReferences<_$AppDatabase, $OverrideRequestTableTable,
              OverrideRequestEntry>
        ),
        OverrideRequestEntry,
        PrefetchHooks Function()>;
typedef $$ProductTableTableCreateCompanionBuilder = ProductTableCompanion
    Function({
  required String id,
  required String name,
  Value<String?> strength,
  Value<String?> pack,
  Value<int> availableStock,
  Value<double?> price,
  Value<int> rowid,
});
typedef $$ProductTableTableUpdateCompanionBuilder = ProductTableCompanion
    Function({
  Value<String> id,
  Value<String> name,
  Value<String?> strength,
  Value<String?> pack,
  Value<int> availableStock,
  Value<double?> price,
  Value<int> rowid,
});

class $$ProductTableTableFilterComposer
    extends Composer<_$AppDatabase, $ProductTableTable> {
  $$ProductTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get strength => $composableBuilder(
      column: $table.strength, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get pack => $composableBuilder(
      column: $table.pack, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get availableStock => $composableBuilder(
      column: $table.availableStock,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get price => $composableBuilder(
      column: $table.price, builder: (column) => ColumnFilters(column));
}

class $$ProductTableTableOrderingComposer
    extends Composer<_$AppDatabase, $ProductTableTable> {
  $$ProductTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get strength => $composableBuilder(
      column: $table.strength, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get pack => $composableBuilder(
      column: $table.pack, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get availableStock => $composableBuilder(
      column: $table.availableStock,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get price => $composableBuilder(
      column: $table.price, builder: (column) => ColumnOrderings(column));
}

class $$ProductTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $ProductTableTable> {
  $$ProductTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get strength =>
      $composableBuilder(column: $table.strength, builder: (column) => column);

  GeneratedColumn<String> get pack =>
      $composableBuilder(column: $table.pack, builder: (column) => column);

  GeneratedColumn<int> get availableStock => $composableBuilder(
      column: $table.availableStock, builder: (column) => column);

  GeneratedColumn<double> get price =>
      $composableBuilder(column: $table.price, builder: (column) => column);
}

class $$ProductTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $ProductTableTable,
    ProductEntry,
    $$ProductTableTableFilterComposer,
    $$ProductTableTableOrderingComposer,
    $$ProductTableTableAnnotationComposer,
    $$ProductTableTableCreateCompanionBuilder,
    $$ProductTableTableUpdateCompanionBuilder,
    (
      ProductEntry,
      BaseReferences<_$AppDatabase, $ProductTableTable, ProductEntry>
    ),
    ProductEntry,
    PrefetchHooks Function()> {
  $$ProductTableTableTableManager(_$AppDatabase db, $ProductTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ProductTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ProductTableTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ProductTableTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> name = const Value.absent(),
            Value<String?> strength = const Value.absent(),
            Value<String?> pack = const Value.absent(),
            Value<int> availableStock = const Value.absent(),
            Value<double?> price = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ProductTableCompanion(
            id: id,
            name: name,
            strength: strength,
            pack: pack,
            availableStock: availableStock,
            price: price,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String name,
            Value<String?> strength = const Value.absent(),
            Value<String?> pack = const Value.absent(),
            Value<int> availableStock = const Value.absent(),
            Value<double?> price = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ProductTableCompanion.insert(
            id: id,
            name: name,
            strength: strength,
            pack: pack,
            availableStock: availableStock,
            price: price,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$ProductTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $ProductTableTable,
    ProductEntry,
    $$ProductTableTableFilterComposer,
    $$ProductTableTableOrderingComposer,
    $$ProductTableTableAnnotationComposer,
    $$ProductTableTableCreateCompanionBuilder,
    $$ProductTableTableUpdateCompanionBuilder,
    (
      ProductEntry,
      BaseReferences<_$AppDatabase, $ProductTableTable, ProductEntry>
    ),
    ProductEntry,
    PrefetchHooks Function()>;
typedef $$SecondarySalesProductTableTableCreateCompanionBuilder
    = SecondarySalesProductTableCompanion Function({
  required String id,
  required String salesId,
  required String productId,
  required String productName,
  required String pack,
  required String strength,
  required String unit,
  Value<int> openingStock,
  Value<int> purchaseQty,
  Value<int> salesQty,
  Value<int> closingStock,
  Value<int> freeQty,
  Value<int> returnedQty,
  Value<int> damageQty,
  Value<double> unitPrice,
  Value<int> rowid,
});
typedef $$SecondarySalesProductTableTableUpdateCompanionBuilder
    = SecondarySalesProductTableCompanion Function({
  Value<String> id,
  Value<String> salesId,
  Value<String> productId,
  Value<String> productName,
  Value<String> pack,
  Value<String> strength,
  Value<String> unit,
  Value<int> openingStock,
  Value<int> purchaseQty,
  Value<int> salesQty,
  Value<int> closingStock,
  Value<int> freeQty,
  Value<int> returnedQty,
  Value<int> damageQty,
  Value<double> unitPrice,
  Value<int> rowid,
});

class $$SecondarySalesProductTableTableFilterComposer
    extends Composer<_$AppDatabase, $SecondarySalesProductTableTable> {
  $$SecondarySalesProductTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get salesId => $composableBuilder(
      column: $table.salesId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get productId => $composableBuilder(
      column: $table.productId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get productName => $composableBuilder(
      column: $table.productName, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get pack => $composableBuilder(
      column: $table.pack, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get strength => $composableBuilder(
      column: $table.strength, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get unit => $composableBuilder(
      column: $table.unit, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get openingStock => $composableBuilder(
      column: $table.openingStock, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get purchaseQty => $composableBuilder(
      column: $table.purchaseQty, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get salesQty => $composableBuilder(
      column: $table.salesQty, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get closingStock => $composableBuilder(
      column: $table.closingStock, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get freeQty => $composableBuilder(
      column: $table.freeQty, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get returnedQty => $composableBuilder(
      column: $table.returnedQty, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get damageQty => $composableBuilder(
      column: $table.damageQty, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get unitPrice => $composableBuilder(
      column: $table.unitPrice, builder: (column) => ColumnFilters(column));
}

class $$SecondarySalesProductTableTableOrderingComposer
    extends Composer<_$AppDatabase, $SecondarySalesProductTableTable> {
  $$SecondarySalesProductTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get salesId => $composableBuilder(
      column: $table.salesId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get productId => $composableBuilder(
      column: $table.productId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get productName => $composableBuilder(
      column: $table.productName, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get pack => $composableBuilder(
      column: $table.pack, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get strength => $composableBuilder(
      column: $table.strength, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get unit => $composableBuilder(
      column: $table.unit, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get openingStock => $composableBuilder(
      column: $table.openingStock,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get purchaseQty => $composableBuilder(
      column: $table.purchaseQty, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get salesQty => $composableBuilder(
      column: $table.salesQty, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get closingStock => $composableBuilder(
      column: $table.closingStock,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get freeQty => $composableBuilder(
      column: $table.freeQty, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get returnedQty => $composableBuilder(
      column: $table.returnedQty, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get damageQty => $composableBuilder(
      column: $table.damageQty, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get unitPrice => $composableBuilder(
      column: $table.unitPrice, builder: (column) => ColumnOrderings(column));
}

class $$SecondarySalesProductTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $SecondarySalesProductTableTable> {
  $$SecondarySalesProductTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get salesId =>
      $composableBuilder(column: $table.salesId, builder: (column) => column);

  GeneratedColumn<String> get productId =>
      $composableBuilder(column: $table.productId, builder: (column) => column);

  GeneratedColumn<String> get productName => $composableBuilder(
      column: $table.productName, builder: (column) => column);

  GeneratedColumn<String> get pack =>
      $composableBuilder(column: $table.pack, builder: (column) => column);

  GeneratedColumn<String> get strength =>
      $composableBuilder(column: $table.strength, builder: (column) => column);

  GeneratedColumn<String> get unit =>
      $composableBuilder(column: $table.unit, builder: (column) => column);

  GeneratedColumn<int> get openingStock => $composableBuilder(
      column: $table.openingStock, builder: (column) => column);

  GeneratedColumn<int> get purchaseQty => $composableBuilder(
      column: $table.purchaseQty, builder: (column) => column);

  GeneratedColumn<int> get salesQty =>
      $composableBuilder(column: $table.salesQty, builder: (column) => column);

  GeneratedColumn<int> get closingStock => $composableBuilder(
      column: $table.closingStock, builder: (column) => column);

  GeneratedColumn<int> get freeQty =>
      $composableBuilder(column: $table.freeQty, builder: (column) => column);

  GeneratedColumn<int> get returnedQty => $composableBuilder(
      column: $table.returnedQty, builder: (column) => column);

  GeneratedColumn<int> get damageQty =>
      $composableBuilder(column: $table.damageQty, builder: (column) => column);

  GeneratedColumn<double> get unitPrice =>
      $composableBuilder(column: $table.unitPrice, builder: (column) => column);
}

class $$SecondarySalesProductTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $SecondarySalesProductTableTable,
    SecondarySalesProductEntry,
    $$SecondarySalesProductTableTableFilterComposer,
    $$SecondarySalesProductTableTableOrderingComposer,
    $$SecondarySalesProductTableTableAnnotationComposer,
    $$SecondarySalesProductTableTableCreateCompanionBuilder,
    $$SecondarySalesProductTableTableUpdateCompanionBuilder,
    (
      SecondarySalesProductEntry,
      BaseReferences<_$AppDatabase, $SecondarySalesProductTableTable,
          SecondarySalesProductEntry>
    ),
    SecondarySalesProductEntry,
    PrefetchHooks Function()> {
  $$SecondarySalesProductTableTableTableManager(
      _$AppDatabase db, $SecondarySalesProductTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$SecondarySalesProductTableTableFilterComposer(
                  $db: db, $table: table),
          createOrderingComposer: () =>
              $$SecondarySalesProductTableTableOrderingComposer(
                  $db: db, $table: table),
          createComputedFieldComposer: () =>
              $$SecondarySalesProductTableTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> salesId = const Value.absent(),
            Value<String> productId = const Value.absent(),
            Value<String> productName = const Value.absent(),
            Value<String> pack = const Value.absent(),
            Value<String> strength = const Value.absent(),
            Value<String> unit = const Value.absent(),
            Value<int> openingStock = const Value.absent(),
            Value<int> purchaseQty = const Value.absent(),
            Value<int> salesQty = const Value.absent(),
            Value<int> closingStock = const Value.absent(),
            Value<int> freeQty = const Value.absent(),
            Value<int> returnedQty = const Value.absent(),
            Value<int> damageQty = const Value.absent(),
            Value<double> unitPrice = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              SecondarySalesProductTableCompanion(
            id: id,
            salesId: salesId,
            productId: productId,
            productName: productName,
            pack: pack,
            strength: strength,
            unit: unit,
            openingStock: openingStock,
            purchaseQty: purchaseQty,
            salesQty: salesQty,
            closingStock: closingStock,
            freeQty: freeQty,
            returnedQty: returnedQty,
            damageQty: damageQty,
            unitPrice: unitPrice,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String salesId,
            required String productId,
            required String productName,
            required String pack,
            required String strength,
            required String unit,
            Value<int> openingStock = const Value.absent(),
            Value<int> purchaseQty = const Value.absent(),
            Value<int> salesQty = const Value.absent(),
            Value<int> closingStock = const Value.absent(),
            Value<int> freeQty = const Value.absent(),
            Value<int> returnedQty = const Value.absent(),
            Value<int> damageQty = const Value.absent(),
            Value<double> unitPrice = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              SecondarySalesProductTableCompanion.insert(
            id: id,
            salesId: salesId,
            productId: productId,
            productName: productName,
            pack: pack,
            strength: strength,
            unit: unit,
            openingStock: openingStock,
            purchaseQty: purchaseQty,
            salesQty: salesQty,
            closingStock: closingStock,
            freeQty: freeQty,
            returnedQty: returnedQty,
            damageQty: damageQty,
            unitPrice: unitPrice,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$SecondarySalesProductTableTableProcessedTableManager
    = ProcessedTableManager<
        _$AppDatabase,
        $SecondarySalesProductTableTable,
        SecondarySalesProductEntry,
        $$SecondarySalesProductTableTableFilterComposer,
        $$SecondarySalesProductTableTableOrderingComposer,
        $$SecondarySalesProductTableTableAnnotationComposer,
        $$SecondarySalesProductTableTableCreateCompanionBuilder,
        $$SecondarySalesProductTableTableUpdateCompanionBuilder,
        (
          SecondarySalesProductEntry,
          BaseReferences<_$AppDatabase, $SecondarySalesProductTableTable,
              SecondarySalesProductEntry>
        ),
        SecondarySalesProductEntry,
        PrefetchHooks Function()>;
typedef $$SecondarySalesTableTableCreateCompanionBuilder
    = SecondarySalesTableCompanion Function({
  required String id,
  required String customerId,
  required String customerName,
  required String customerType,
  required String entryType,
  required DateTime entryDate,
  Value<double> totalSalesValue,
  Value<double> totalStockValue,
  Value<int> totalSalesQty,
  Value<int> totalClosingStock,
  Value<String> status,
  Value<String?> managerRemarks,
  Value<int> syncStatus,
  Value<int> rowid,
});
typedef $$SecondarySalesTableTableUpdateCompanionBuilder
    = SecondarySalesTableCompanion Function({
  Value<String> id,
  Value<String> customerId,
  Value<String> customerName,
  Value<String> customerType,
  Value<String> entryType,
  Value<DateTime> entryDate,
  Value<double> totalSalesValue,
  Value<double> totalStockValue,
  Value<int> totalSalesQty,
  Value<int> totalClosingStock,
  Value<String> status,
  Value<String?> managerRemarks,
  Value<int> syncStatus,
  Value<int> rowid,
});

class $$SecondarySalesTableTableFilterComposer
    extends Composer<_$AppDatabase, $SecondarySalesTableTable> {
  $$SecondarySalesTableTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerName => $composableBuilder(
      column: $table.customerName, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerType => $composableBuilder(
      column: $table.customerType, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get entryType => $composableBuilder(
      column: $table.entryType, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get entryDate => $composableBuilder(
      column: $table.entryDate, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get totalSalesValue => $composableBuilder(
      column: $table.totalSalesValue,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get totalStockValue => $composableBuilder(
      column: $table.totalStockValue,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get totalSalesQty => $composableBuilder(
      column: $table.totalSalesQty, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get totalClosingStock => $composableBuilder(
      column: $table.totalClosingStock,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get managerRemarks => $composableBuilder(
      column: $table.managerRemarks,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnFilters(column));
}

class $$SecondarySalesTableTableOrderingComposer
    extends Composer<_$AppDatabase, $SecondarySalesTableTable> {
  $$SecondarySalesTableTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerName => $composableBuilder(
      column: $table.customerName,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerType => $composableBuilder(
      column: $table.customerType,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get entryType => $composableBuilder(
      column: $table.entryType, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get entryDate => $composableBuilder(
      column: $table.entryDate, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get totalSalesValue => $composableBuilder(
      column: $table.totalSalesValue,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get totalStockValue => $composableBuilder(
      column: $table.totalStockValue,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get totalSalesQty => $composableBuilder(
      column: $table.totalSalesQty,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get totalClosingStock => $composableBuilder(
      column: $table.totalClosingStock,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get managerRemarks => $composableBuilder(
      column: $table.managerRemarks,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => ColumnOrderings(column));
}

class $$SecondarySalesTableTableAnnotationComposer
    extends Composer<_$AppDatabase, $SecondarySalesTableTable> {
  $$SecondarySalesTableTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => column);

  GeneratedColumn<String> get customerName => $composableBuilder(
      column: $table.customerName, builder: (column) => column);

  GeneratedColumn<String> get customerType => $composableBuilder(
      column: $table.customerType, builder: (column) => column);

  GeneratedColumn<String> get entryType =>
      $composableBuilder(column: $table.entryType, builder: (column) => column);

  GeneratedColumn<DateTime> get entryDate =>
      $composableBuilder(column: $table.entryDate, builder: (column) => column);

  GeneratedColumn<double> get totalSalesValue => $composableBuilder(
      column: $table.totalSalesValue, builder: (column) => column);

  GeneratedColumn<double> get totalStockValue => $composableBuilder(
      column: $table.totalStockValue, builder: (column) => column);

  GeneratedColumn<int> get totalSalesQty => $composableBuilder(
      column: $table.totalSalesQty, builder: (column) => column);

  GeneratedColumn<int> get totalClosingStock => $composableBuilder(
      column: $table.totalClosingStock, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<String> get managerRemarks => $composableBuilder(
      column: $table.managerRemarks, builder: (column) => column);

  GeneratedColumn<int> get syncStatus => $composableBuilder(
      column: $table.syncStatus, builder: (column) => column);
}

class $$SecondarySalesTableTableTableManager extends RootTableManager<
    _$AppDatabase,
    $SecondarySalesTableTable,
    SecondarySalesEntry,
    $$SecondarySalesTableTableFilterComposer,
    $$SecondarySalesTableTableOrderingComposer,
    $$SecondarySalesTableTableAnnotationComposer,
    $$SecondarySalesTableTableCreateCompanionBuilder,
    $$SecondarySalesTableTableUpdateCompanionBuilder,
    (
      SecondarySalesEntry,
      BaseReferences<_$AppDatabase, $SecondarySalesTableTable,
          SecondarySalesEntry>
    ),
    SecondarySalesEntry,
    PrefetchHooks Function()> {
  $$SecondarySalesTableTableTableManager(
      _$AppDatabase db, $SecondarySalesTableTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$SecondarySalesTableTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$SecondarySalesTableTableOrderingComposer(
                  $db: db, $table: table),
          createComputedFieldComposer: () =>
              $$SecondarySalesTableTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> customerId = const Value.absent(),
            Value<String> customerName = const Value.absent(),
            Value<String> customerType = const Value.absent(),
            Value<String> entryType = const Value.absent(),
            Value<DateTime> entryDate = const Value.absent(),
            Value<double> totalSalesValue = const Value.absent(),
            Value<double> totalStockValue = const Value.absent(),
            Value<int> totalSalesQty = const Value.absent(),
            Value<int> totalClosingStock = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<String?> managerRemarks = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              SecondarySalesTableCompanion(
            id: id,
            customerId: customerId,
            customerName: customerName,
            customerType: customerType,
            entryType: entryType,
            entryDate: entryDate,
            totalSalesValue: totalSalesValue,
            totalStockValue: totalStockValue,
            totalSalesQty: totalSalesQty,
            totalClosingStock: totalClosingStock,
            status: status,
            managerRemarks: managerRemarks,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String customerId,
            required String customerName,
            required String customerType,
            required String entryType,
            required DateTime entryDate,
            Value<double> totalSalesValue = const Value.absent(),
            Value<double> totalStockValue = const Value.absent(),
            Value<int> totalSalesQty = const Value.absent(),
            Value<int> totalClosingStock = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<String?> managerRemarks = const Value.absent(),
            Value<int> syncStatus = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              SecondarySalesTableCompanion.insert(
            id: id,
            customerId: customerId,
            customerName: customerName,
            customerType: customerType,
            entryType: entryType,
            entryDate: entryDate,
            totalSalesValue: totalSalesValue,
            totalStockValue: totalStockValue,
            totalSalesQty: totalSalesQty,
            totalClosingStock: totalClosingStock,
            status: status,
            managerRemarks: managerRemarks,
            syncStatus: syncStatus,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$SecondarySalesTableTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $SecondarySalesTableTable,
    SecondarySalesEntry,
    $$SecondarySalesTableTableFilterComposer,
    $$SecondarySalesTableTableOrderingComposer,
    $$SecondarySalesTableTableAnnotationComposer,
    $$SecondarySalesTableTableCreateCompanionBuilder,
    $$SecondarySalesTableTableUpdateCompanionBuilder,
    (
      SecondarySalesEntry,
      BaseReferences<_$AppDatabase, $SecondarySalesTableTable,
          SecondarySalesEntry>
    ),
    SecondarySalesEntry,
    PrefetchHooks Function()>;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$SyncQueueTableTableTableManager get syncQueueTable =>
      $$SyncQueueTableTableTableManager(_db, _db.syncQueueTable);
  $$AttendanceTableTableTableManager get attendanceTable =>
      $$AttendanceTableTableTableManager(_db, _db.attendanceTable);
  $$CustomerTableTableTableManager get customerTable =>
      $$CustomerTableTableTableManager(_db, _db.customerTable);
  $$DcrCheckInTableTableTableManager get dcrCheckInTable =>
      $$DcrCheckInTableTableTableManager(_db, _db.dcrCheckInTable);
  $$DcrCheckOutTableTableTableManager get dcrCheckOutTable =>
      $$DcrCheckOutTableTableTableManager(_db, _db.dcrCheckOutTable);
  $$DcrReportTableTableTableManager get dcrReportTable =>
      $$DcrReportTableTableTableManager(_db, _db.dcrReportTable);
  $$DcrSubmissionTableTableTableManager get dcrSubmissionTable =>
      $$DcrSubmissionTableTableTableManager(_db, _db.dcrSubmissionTable);
  $$DeviationTableTableTableManager get deviationTable =>
      $$DeviationTableTableTableManager(_db, _db.deviationTable);
  $$ExpenseApprovalTableTableTableManager get expenseApprovalTable =>
      $$ExpenseApprovalTableTableTableManager(_db, _db.expenseApprovalTable);
  $$ExpenseAuditTableTableTableManager get expenseAuditTable =>
      $$ExpenseAuditTableTableTableManager(_db, _db.expenseAuditTable);
  $$ExpenseBillTableTableTableManager get expenseBillTable =>
      $$ExpenseBillTableTableTableManager(_db, _db.expenseBillTable);
  $$ExpensePaymentTableTableTableManager get expensePaymentTable =>
      $$ExpensePaymentTableTableTableManager(_db, _db.expensePaymentTable);
  $$ExpenseTableTableTableManager get expenseTable =>
      $$ExpenseTableTableTableManager(_db, _db.expenseTable);
  $$GpsLogTableTableTableManager get gpsLogTable =>
      $$GpsLogTableTableTableManager(_db, _db.gpsLogTable);
  $$HolidayTableTableTableManager get holidayTable =>
      $$HolidayTableTableTableManager(_db, _db.holidayTable);
  $$JointWorkTableTableTableManager get jointWorkTable =>
      $$JointWorkTableTableTableManager(_db, _db.jointWorkTable);
  $$MiscExpenseTableTableTableManager get miscExpenseTable =>
      $$MiscExpenseTableTableTableManager(_db, _db.miscExpenseTable);
  $$MtpAuditTableTableTableManager get mtpAuditTable =>
      $$MtpAuditTableTableTableManager(_db, _db.mtpAuditTable);
  $$MtpSettingsTableTableTableManager get mtpSettingsTable =>
      $$MtpSettingsTableTableTableManager(_db, _db.mtpSettingsTable);
  $$MtpTableTableTableManager get mtpTable =>
      $$MtpTableTableTableManager(_db, _db.mtpTable);
  $$MtpDayTableTableTableManager get mtpDayTable =>
      $$MtpDayTableTableTableManager(_db, _db.mtpDayTable);
  $$MtpDoctorTableTableTableManager get mtpDoctorTable =>
      $$MtpDoctorTableTableTableManager(_db, _db.mtpDoctorTable);
  $$OverrideRequestTableTableTableManager get overrideRequestTable =>
      $$OverrideRequestTableTableTableManager(_db, _db.overrideRequestTable);
  $$ProductTableTableTableManager get productTable =>
      $$ProductTableTableTableManager(_db, _db.productTable);
  $$SecondarySalesProductTableTableTableManager
      get secondarySalesProductTable =>
          $$SecondarySalesProductTableTableTableManager(
              _db, _db.secondarySalesProductTable);
  $$SecondarySalesTableTableTableManager get secondarySalesTable =>
      $$SecondarySalesTableTableTableManager(_db, _db.secondarySalesTable);
}
