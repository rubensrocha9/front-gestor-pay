import { EnvironmentProviders, importProvidersFrom } from '@angular/core';
import {
  AppstoreOutline,
  BankOutline,
  CloseOutline,
  DashboardOutline,
  DeleteOutline,
  EyeInvisibleOutline,
  EyeOutline,
  FormOutline,
  IdcardOutline,
  LikeOutline,
  LockOutline,
  LogoutOutline,
  MailOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  PlusCircleFill,
  PlusCircleOutline,
  PlusCircleTwoTone,
  PlusOutline,
  SearchOutline,
  TeamOutline,
  UserOutline
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

const icons = [
  LikeOutline,
  MailOutline,
  EyeInvisibleOutline,
  EyeOutline,
  LogoutOutline,
  LockOutline,
  CloseOutline,
  SearchOutline,
  TeamOutline,
  PlusOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  FormOutline,
  UserOutline,
  AppstoreOutline,
  BankOutline,
  IdcardOutline,
  DeleteOutline,
  PlusCircleOutline,
  PlusCircleTwoTone,
  PlusCircleFill
];

export function provideNzIcons(): EnvironmentProviders {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}
