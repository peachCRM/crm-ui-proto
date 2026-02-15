export interface MenuItem {
  id: number;
  name: string;
  url: string;
  icon: string;
  hideInProd: boolean;
  children: ChildMenuItem[];
  parentNumber: number;
  src: string;
}

export interface ChildMenuItem {
  id: number;
  parentNumber: number;
  name: string;
  url: string;
  hideInProd: boolean;
  icon: string;
}

export interface LeftMenuState {
  leftMenus: MenuItem[];
}
