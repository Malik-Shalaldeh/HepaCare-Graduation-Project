import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../style/theme";
import {
  roles,
  chooseRole,
  searchUser,
  selectUser,
  updatePassword,
} from "../componentAdmin/updateUserpassFunctions";

import styles from "../componentAdmin/updateUserpassStyles";

export default function UpdateUserPasswordScreen() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  return (
    <View style={styles.screen}>

      <Text style={styles.label}>اختر الدور</Text>

      <View style={styles.rolesRow}>
        {roles.map((r) => (
          <TouchableOpacity
            key={r.key}
            onPress={() => chooseRole(r.key, setRole, setUser, setResults, setName)}
            style={[styles.roleBtn, role === r.key && styles.roleBtnActive]}
          >
            <Text style={[styles.roleText, role === r.key && styles.roleTextActive]}>
              {r.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {role && role !== "HEALTH" && role !== "ADMIN" && (
        <>
          <Text style={styles.label}>الاسم</Text>
          <View style={styles.searchBox}>
           <TextInput
            style={styles.searchInput}
            placeholder="ابحث بالاسم أو الرقم"
            value={name}
            onChangeText={(n)=>{
              setName(n)
              searchUser(role, n, setResults)
            }}
            textAlign="right"
            placeholderTextColor={theme.colors.textMuted}
          />

            <TouchableOpacity onPress={() => searchUser(role, name, setResults)} style={styles.searchIcon}>
              <Ionicons name="search-outline" size={18} color={theme.colors.buttonPrimaryText} />
            </TouchableOpacity>
          </View>
        </>
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => selectUser(item.id, role, setUser, setResults)}
              style={styles.resultItem}
            >
              <Text style={styles.resultText}>{item.name} ({item.role})</Text>
            </TouchableOpacity>
          )}
          
        />
      )}
      
     {!user && results.length === 0 && name.trim() !== "" && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          لا يوجد نتائج
        </Text>
      )}

      {user && (
        <View style={styles.userCard}>
          <Text style={styles.userName}>{user.name}</Text>

          {user.role === "PATIENT" && (
            <Text style={styles.userMeta}>رقم الهوية: {user.nationalId}</Text>
          )}

          {user.role === "DOCTOR" && (
            <Text style={styles.userMeta}>رقم الطبيب: {user.doctorId}</Text>
          )}

          <Text style={styles.userMeta}>الدور: {user.role}</Text>
        </View>
      )}

      {user && (
        <>
          <Text style={styles.label}>كلمة المرور الجديدة</Text>

          <TextInput
            style={styles.input}
            placeholder="كلمة المرور"
            value={pass1}
            onChangeText={setPass1}
            secureTextEntry
            placeholderTextColor={theme.colors.textMuted}
            textAlign="right"
          />

          <TextInput
            style={styles.input}
            placeholder="تأكيد كلمة المرور"
            value={pass2}
            onChangeText={setPass2}
            secureTextEntry
            placeholderTextColor={theme.colors.textMuted}
            textAlign="right"
          />

          <TouchableOpacity
            onPress={() => updatePassword(user, pass1, pass2, setUser, setPass1, setPass2)}
            style={styles.updateBtn}
          >
            <Text style={styles.updateText}>تحديث كلمة المرور</Text>
          </TouchableOpacity>
        </>
      )}

    </View>
  );
}
