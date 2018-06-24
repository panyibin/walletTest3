//
//  PayCoinViewController.m
//  SkyWallet
//
//  Created by PanYibin on 2018/3/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "PayCoinViewController.h"

@interface PayCoinViewController ()

@property (nonatomic, strong) WalletModel *walletModel;
@property (nonatomic, strong) RCTRootView *payView;

//used for RN
@property (nonatomic, strong) NSString *balance;

@end

@implementation PayCoinViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
  if(self.walletModelDict) {
    self.walletModel = [[WalletModel alloc] initWithDictionary:self.walletModelDict];
    
    CGFloat balanceNum = [self.walletModelDict getFloatForKey:@"balance"];
    self.balance = [NSString stringWithFormat:@"%.3f", balanceNum];
  }
  
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didGetAddressFromQRCodeNotification:) name:kGetAddressFromQRCodeNotification object:nil];
  
  [self refreshPage];
}

- (void)viewDidAppear:(BOOL)animated {
  
}

- (void)refreshPage {
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    //[self loadData];
    
    dispatch_async(dispatch_get_main_queue(), ^{
      NSDictionary *initialProperties = @{
                                          @"walletModelDict":self.walletModelDict ? : @{},
                                          @"balance":self.balance ? : @"0"
                                          };
      
      if (!self.payView) {
        self.payView = [RNManager viewWithModuleName:@"PayView" initialProperties:initialProperties];
        [self.view addSubview:self.payView];
        [self.payView mas_makeConstraints:^(MASConstraintMaker *make) {
          make.edges.mas_equalTo(self.view);
        }];
      } else {
        self.payView.appProperties = initialProperties;
      }
    });
  });
}

- (void)loadData {
  WalletBalanceModel *wbm = [[WalletManager sharedInstance] getBalanceOfWallet:self.walletModel.walletId coinType:kCoinTypeSky];
  self.balance = wbm.balance;
}
//kGetAddressFromQRCodeNotification
- (void)didGetAddressFromQRCodeNotification:(NSNotification*)notification {
  NSMutableDictionary *initialAppProperties = [NSMutableDictionary dictionaryWithDictionary:self.payView.appProperties];
  
  NSString *targetAddress = [notification.userInfo getStringForKey:kUserInfoTargetAddress];
  if (targetAddress) {
    [initialAppProperties setObject:targetAddress forKey:@"targetAddress"];
    self.payView.appProperties = initialAppProperties;
  } else {
    NSLog(@"fail to get target Address");
  }
  
}

- (void)loadView {
  UIView *view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  view.backgroundColor = [UIColor whiteColor];
  self.view = view;
}

@end
